import {
  SagaBuilder,
  SagaExecutionFailed,
  SagaCompensationFailed,
  SagaStepInvocationFailed,
  SagaStepCompensationFailed,
} from "node-sagas";
import * as yup from "yup";
import { promises as fs } from "fs";

const fileValidator = yup.object().shape({
  name: yup.string().required(),
  path: yup.string().required(),
  size: yup.number().required().integer(),
  type: yup
    .string()
    .required()
    .matches(/^image\/.+/),
});
const dishPicturesValidator = yup.array(fileValidator.required()).required();
const dishCreationValidator = yup.object().shape({
  name: yup.string().required().trim(),
  price: yup.number().required(),
  description: yup.string().trim(),
  pictures: yup.array(fileValidator.required()).required(),
  cuisine: yup.number().nullable(),
  /**
   * Accept both existing ingredient IDs (number) and new arbitrary ingredients (string)
   */
  ingredients: yup
    .array(yup.mixed().oneOf([yup.number(), yup.string()]))
    .nullable(),
  menu: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9]{8}$/),
  restaurantId: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9]{8}$/),
  userId: yup.number().required().integer(),
});

/**
 * @TODO Handle ingredients
 */
export default class DishesService {
  static dishPicturesValidator = dishPicturesValidator;
  static dishCreationValidator = dishCreationValidator;

  constructor(
    dishRepository,
    fileRepository,
    s3,
    dishPictureRepository,
    dishIngredientRepository,
    restaurantIngredientRepository
  ) {
    this.dishRepository = dishRepository;
    this.fileRepository = fileRepository;
    this.s3 = s3;
    this.dishPictureRepository = dishPictureRepository;
    this.dishIngredientRepository = dishIngredientRepository;
    this.restaurantIngredientRepository = restaurantIngredientRepository;
  }

  findDishById(dishId) {
    return this.dishRepository
      .findById(dishId)
      .then(
        this.dishRepository.constructor.transform.bind(this.dishRepository)
      );
  }

  findDishesByMenuId(menuId) {
    return this.dishRepository.findByMenuId(menuId);
  }

  async createDish(data) {
    const validatedData = await this.constructor.dishCreationValidator.validate(
      data
    );
    const {
      pictures,
      ingredients,
      restaurantId,
      userId,
      ...dishData
    } = validatedData;
    const sagaCallback = (callback, isInvocation = true) =>
      async function (params) {
        console.log(
          `${isInvocation ? `Invoke` : `Compensate`} "${this.getName()}" step`
        );
        return callback(params, this);
      };
    const sagaBuilder = new SagaBuilder();
    const saga = sagaBuilder
      .step(`Insert dish data into 'dishes' table`)
      .invoke(
        sagaCallback(async params => {
          params.createdDishId = await this.dishRepository.add(dishData);
        })
      )
      .withCompensation(
        sagaCallback(params => {
          if (!params.createdDishId) return;

          console.log(`removing dish '${params.createdDishId}'`);
          return this.dishRepository
            .remove("id", params.createdDishId)
            .then(result => console.log(`remove result: `, result));
        }, false)
      )
      .step(`Upload picture files to S3`)
      .invoke(
        sagaCallback(async params => {
          if (params.data.pictures.length) {
            params.uploadedFilesInfo = await this._uploadDishPictureFiles(
              params.createdDishId,
              params.data.userId,
              ...params.data.pictures
            );
          }
        })
      )
      .withCompensation(
        sagaCallback(async params => {
          if (params.uploadedFilesInfo) {
            // Remove files from s3
            console.log(`Remove files from s3`);
            const results = await this._removeDishPictureFilesOnS3(
              params.createdDishId
            );
            console.log(`remove results: `, results);
          }
        }, false)
      )
      .step(`Save uploaded files info into 'files' table`)
      .invoke(
        sagaCallback(async params => {
          if (params.uploadedFilesInfo) {
            params.savedFilesId = await this._savePictureFiles(
              params.uploadedFilesInfo
            );
          }
        })
      )
      .withCompensation(
        sagaCallback(params => {
          if (params.savedFilesId) {
            const removePromises = params.savedFilesId.forEach(fid =>
              this.fileRepository.remove("id", fid)
            );

            return Promise.all(removePromises);
          }
        }, false)
      )
      .step(`Link saved picture files id to dish id`)
      .invoke(
        sagaCallback(params => {
          return this._linkSavedPictureFilesIdtoDishId(
            params.createdDishId,
            params.savedFilesId
          );
        })
      )
      .step(`Add ingredients`)
      .invoke(
        sagaCallback(async params => {
          if (!params.ingredients.length) return;

          console.log(
            `Separating new ingredients from existing ingredients...`
          );
          const [
            existingIngredients,
            newIngredients,
          ] = params.ingredients.reduce(
            (arr, ingredient) => {
              const index = typeof ingredient === "number" ? 0 : 1;

              arr[index].push(ingredient);

              return arr;
            },
            [[], []]
          );
          console.log(`existing ingredients: `, existingIngredients);
          console.log(`new ingredients: `, newIngredients);
          console.log(`done\n\n`);

          let newInsertedRestaurantIngredientIds = [];

          if (newIngredients.length) {
            const newRestaurantIngredients = newIngredients.map(ingredient => ({
              restaurant: restaurantId,
              name: ingredient,
            }));
            console.log(`newRestaurantIngredients: `, newRestaurantIngredients);
            console.log(
              `storing new ingredients into the 'restaurant_ingredients' table...`
            );

            if (newRestaurantIngredients.length) {
              newInsertedRestaurantIngredientIds = await this.restaurantIngredientRepository.add(
                newRestaurantIngredients
              );
              params.newRestaurantIngredientIds = newInsertedRestaurantIngredientIds;
            }
            console.log(
              `newInsertedRestaurantIngredientIds: `,
              newInsertedRestaurantIngredientIds
            );
          }

          const allIngredientsId = [
            ...existingIngredients,
            ...newInsertedRestaurantIngredientIds,
          ];
          console.log(`allIngredientIds: `, allIngredientsId);
          const newDishIngredients = allIngredientsId.map(iid => ({
            dish: createdDishId,
            ingredient: iid,
          }));
          console.log(`newDishIngredients: `, newDishIngredients);

          console.log(`Storing 'dish_ingredients'`);
          const newInsertedDishIngredientIds = await this.dishIngredientRepository.add(
            newDishIngredients
          );
          params.newInsertedDishIngredientIds = newInsertedDishIngredientIds;
          console.log(
            `newInsertedDishIngredientIds: `,
            newInsertedDishIngredientIds
          );
          console.log(`done\n\n`);
        })
      )
      .withCompensation(
        sagaCallback(async params => {
          if (params.newInsertedRestaurantIngredientIds) {
            this.restaurantIngredientRepository.remove(
              "id",
              params.newInsertedRestaurantIngredientIds
            );
          }

          if (params.newInsertedDishIngredientIds) {
            this.dishIngredientRepository.remove(
              "id",
              params.newInsertedDishIngredientIds
            );
          }
        }, false)
      )
      .build();

    const params = { data: validatedData };

    try {
      const returnedParams = await saga.execute(params);

      console.log(`returnedParams: `, returnedParams);

      return returnedParams.createdDishId;
    } catch (e) {
      console.log(e);
      if (e instanceof SagaExecutionFailed) {
        console.log(`SagaExecutionFailed`);

        if (e.originalError instanceof SagaStepInvocationFailed)
          throw e.originalError.originalError;
      }

      if (e instanceof SagaCompensationFailed) {
        console.log(`SagaCompensationFailed`);

        if (e.originalError instanceof SagaStepCompensationFailed)
          throw e.originalError.originalError;
      }

      throw e.originalError;
    }
  }

  /**
   *
   * @param  {...Array<File>} files
   * @returns Array<Promise<UploadInfo>>
   */
  async _uploadDishPictureFiles(dishId, userId, ...files) {
    const dish = await this.dishRepository.findById(dishId);

    if (!dish) throw new Error(`Dish '${dishId}' could not be found`);

    const validatedPictures = await DishesService.dishPicturesValidator.validate(
      files
    );

    console.log(`validatedPictures: `, validatedPictures);

    const uploadedFileInfoPromises = validatedPictures.map(async picture => {
      const [name, ext] = picture.name.split(".");
      const fileName = `${name}-${Date.now()}.${ext}`;
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        ACL: "public-read",
        Key: this._composeDishPictureS3FileKey(dishId, fileName),
        Body: await fs.readFile(picture.path),
        ContentType: picture.type,
      };

      return this.s3
        .upload(s3Params)
        .promise()
        .then(uploadInfo => ({
          name: fileName,
          path: uploadInfo.Location,
          type: picture.type,
          size: picture.size,
          addedBy: userId,
        }));
    });

    return Promise.all(uploadedFileInfoPromises);
  }

  _composeDishPictureS3FileKey(dishId, fileName) {
    return `dishes/${dishId}/${fileName}`;
  }

  /**
   *
   * @returns Array<Number> Array of file ID
   */
  _savePictureFiles(pictureFiles) {
    const savePromises = pictureFiles.map(fileInfo =>
      this.fileRepository.add(fileInfo)
    );

    return Promise.all(savePromises);
  }

  _linkSavedPictureFilesIdtoDishId(dishId, savedPicturesId) {
    const dishPictures = savedPicturesId.map(pid => ({
      dish: dishId,
      file: pid,
    }));

    return this.dishPictureRepository.add(dishPictures);
  }

  _getDishPictures(dishId) {
    return this.dishPictureRepository
      .find()
      .where("dish", dishId)
      .then(this.dishPictureRepository.transform);
  }

  async _removeDishPictureFilesOnS3(dishId) {
    const files = await this._getDishPictures(dishId).then(dps =>
      dps.map(dp => dp.file)
    );

    if (!files.length) return [];

    console.log(`files: `, files);

    const deleteFilePromises = files.map(file => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: this._composeDishPictureS3FileKey(dishId, file.name),
      };

      return this.s3.deleteObject(params).promise();
    });

    return Promise.all(deleteFilePromises);
  }
}

/**
 * Code for ingredients
 */
// if (ingredients.length) {
//         console.log(`Separating new ingredients from existing ingredients...`);
//         const [existingIngredients, newIngredients] = ingredients.reduce(
//           (arr, ingredient) => {
//             const index = typeof ingredients === "number" ? 0 : 1;

//             arr[index].push(ingredient);

//             return arr;
//           },
//           [[], []]
//         );
//         console.log(`existing ingredients: `, existingIngredients);
//         console.log(`new ingredients: `, newIngredients);
//         console.log(`done\n\n`);
//         const newRestaurantIngredients = newIngredients.map(ingredient => ({
//           restaurant: restaurantId,
//           name: ingredient,
//         }));
//         console.log(`newRestaurantIngredients: `, newRestaurantIngredients);
//         console.log(
//           `storing new ingredients into the 'restaurant_ingredients' table...`
//         );

//         let insertedIngredientIds = [];

//         if (newRestaurantIngredients.length) {
//           insertedIngredientIds = await createRestaurantIngredient(
//             newRestaurantIngredients
//           );
//         }
//         console.log(`insertedIngredientIds: `, insertedIngredientIds);
//         const allIngredientsId = [
//           ...existingIngredients,
//           ...insertedIngredientIds,
//         ];
//         console.log(`allIngredientIds: `, allIngredientsId);
//         const dishIngredients = allIngredientsId.map(iid => ({
//           dish: createdDishId,
//           ingredient: iid,
//         }));
//         console.log(`dishIngredients: `, dishIngredients);

//         console.log(`Storing 'dish_ingredients'`);
//         await knex("dish_ingredients").insert(dishIngredients);
//         console.log(`done\n\n`);
//       }
