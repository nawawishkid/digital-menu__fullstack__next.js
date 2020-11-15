import * as yup from "yup";
import { promises as fs } from "fs";
import {
  SagaBuilder,
  SagaCompensationFailed,
  SagaExecutionFailed,
  SagaStepCompensationFailed,
  SagaStepInvocationFailed,
} from "node-sagas";
import jsFileValidator from "../yup-validators/js-file-validator";

const createRestaurantDTOValidator = yup.object().shape({
  name: yup.string().required().trim(),
  bio: yup.string().trim(),
  owner: yup.number().required().integer(),
  profilePicture: fileValidator.required(),
});

export default class RestaurantsService {
  static createRestaurantDTOValidator = createRestaurantDTOValidator;

  constructor(
    restaurantRepository,
    restaurantIngredientRepository,
    fileRepository,
    menuRepository,
    s3
  ) {
    this.restaurantRepository = restaurantRepository;
    this.restaurantIngredientRepository = restaurantIngredientRepository;
    this.fileRepository = fileRepository;
    this.menuRepository = menuRepository;
    this.s3 = s3;
  }

  findRestaurantById(restaurantId) {
    return this.restaurantRepository.findById(restaurantId);
  }

  findRestaurantByOwnerId(ownerId) {
    return this.restaurantRepository.findRestaurantByOwnerId(ownerId);
  }

  async createRestaurant(data) {
    const validatedData = await this.constructor.createRestaurantDTOValidator.validate(
      data
    );
    const sagaBuilder = new SagaBuilder();
    const sagaCallback = (callback, isInvocation = true) =>
      async function (params) {
        console.log(
          `${isInvocation ? `Invoke` : `Compensate`} "${this.getName()}" step`
        );
        return callback(params, this);
      };

    console.log(`validatedData: `, validatedData);

    const saga = sagaBuilder
      .step(`Insert restaurant data`)
      .invoke(
        sagaCallback(async params => {
          params.createdRestaurantId = await this.restaurantRepository.add(
            params.restaurantData
          );
        })
      )
      .withCompensation(
        sagaCallback(params => {
          if (!params.createdRestaurantId)
            throw new Error(`params.createdRestaurantId is required`);

          return this.deleteRestaurant(params.createdRestaurantId);
        }, false)
      )
      .step(`Upload profile picture to S3`)
      .invoke(
        sagaCallback(async params => {
          if (!params.createdRestaurantId)
            throw new Error(`params.createdRestaurantId is required`);

          params.s3Info = await this.uploadProfilePictureToS3(
            params.createdRestaurantId,
            params.profilePicture
          );
        })
      )
      .withCompensation(
        sagaCallback(params => {
          if (!params.createdRestaurantId)
            throw new Error(`params.createdRestaurantId is required`);

          if (!params.s3Info) throw new Error(`params.s3Info is required`);

          const s3Params = {
            Key: this._composeProfilePictureS3Key(
              params.createdRestaurantId,
              params.s3Info.name
            ),
            Bucket: process.env.AWS_BUCKET_NAME,
          };

          return this.s3.deleteObject(s3Params).promise();
        }, false)
      )
      .step(`Save profile picture file info from S3 to database`)
      .invoke(
        sagaCallback(async params => {
          if (!params.s3Info) throw new Error(`params.s3Info is required`);

          params.profilePictureFileId = await this.saveProfilePictureFileInfoToDatabase(
            params.restaurantData.owner,
            params.s3Info
          );
        })
      )
      .withCompensation(
        sagaCallback(params => {
          if (!params.profilePictureFileId)
            throw new Error(`params.profilePictureFileId is required`);

          return this.fileRepository.remove("id", params.profilePictureFileId);
        }, false)
      )
      .step(`Create default menu`)
      .invoke(
        sagaCallback(async params => {
          if (!params.createdRestaurantId)
            throw new Error(`params.createdRestaurantId is required`);

          if (!params.restaurantData || !params.restaurantData.owner)
            throw new Error(`params.restaurantData.owner is required`);

          params.createdMenuId = await this.menuRepository.add({
            name: `default`,
            ownedBy: params.createdRestaurantId,
            createdBy: params.restaurantData.owner,
          });
        })
      )
      .withCompensation(
        sagaCallback(params => {
          if (!params.createdMenuId)
            throw new Error(`params.createdMenuId is required`);

          return this.menuRepository.remove("id", params.createdMenuId);
        }, false)
      )
      .step(`Update profile picture file to restaurant`)
      .invoke(
        sagaCallback(params => {
          if (!params.profilePictureFileId)
            throw new Error(`params.profilePictureFileId is required`);

          return this.updateRestaurant(params.createdRestaurantId, {
            profilePicture: params.profilePictureFileId,
          });
        })
      )
      .build();

    const { profilePicture, ...restaurantData } = validatedData;
    const sagaParams = { restaurantData, profilePicture };

    try {
      const returnedSagaParams = await saga.execute(sagaParams);

      return returnedSagaParams.createdRestaurantId;
    } catch (e) {
      if (e instanceof SagaExecutionFailed) {
        console.log(`SagaExecutionFailed`);

        // if (e.originalError instanceof SagaStepInvocationFailed)
        //   throw e.originalError.originalError;
      }

      if (e instanceof SagaCompensationFailed) {
        console.log(`SagaCompensationFailed`);

        // if (e.originalError instanceof SagaStepCompensationFailed)
        //   throw e.originalError.originalError;
      }

      throw e;
      // throw e.originalError;
    }
  }

  /**
   * @TODO Use saga
   */
  updateRestaurant(restaurantId, userId, data) {
    /**
     * @pseudocode
     *
     * if profilePicture is a file
     *    upload the file to S3
     *    save uploaded file info into 'files' table
     *    reference the file id and update new data in 'restaurants' table
     * else if profilePicture is an integer
     *    update restaurant
     * else
     *    throw new Error(Invalid profilePicture data)
     *
     */
    console.log(`data: `, data);
    if (typeof data.profilePicture === "number") {
      return this.restaurantRepository.update("id", restaurantId, data);
    } else if (jsFileValidator.isValidSync(data.profilePicture)) {
      return this.uploadProfilePictureToS3(restaurantId, data.profilePicture)
        .then(f => this.saveProfilePictureFileInfoToDatabase(userId, f))
        .then(([fid]) =>
          this.updateRestaurant(restaurantId, userId, { profilePicture: fid })
        );
    } else {
      throw new Error(`Invalid data type of 'profilePicture'`);
    }
  }

  deleteRestaurant(restaurantId) {
    return this.restaurantRepository.remove("id", restaurantId);
  }

  async uploadProfilePictureToS3(restaurantId, file) {
    const [fileName, fileExtension] = file.name.split(".");
    const newFileName = `${fileName}-${Date.now()}.${fileExtension}`;
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: await fs.readFile(file.path),
      Key: this._composeProfilePictureS3Key(restaurantId, newFileName),
      ContentType: file.type,
      ACL: "public-read",
    };

    return this.s3
      .upload(s3Params)
      .promise()
      .then(data => ({
        name: newFileName,
        type: file.type,
        path: data.Location,
        size: file.size,
      }));
  }

  _composeProfilePictureS3Key(restaurantId, fileName) {
    return `restaurants/${restaurantId}/${fileName}`;
  }

  saveProfilePictureFileInfoToDatabase(userId, file) {
    return this.fileRepository.add({ ...file, addedBy: userId });
  }

  addIngredients(ingredients) {
    return this.restaurantIngredientRepository.add(ingredients);
  }

  removeIngredient(restaurantIngredientId) {
    return this.restaurantIngredientRepository.remove(
      "id",
      restaurantIngredientId
    );
  }
}

// const transformJoinedResult = ({ r, u, f }) => {
//   delete u.createdAt;

//   return { ...r, profilePicture: f.path, owner: u };
// };
// const transformJoinedResultMultiple = rows => rows.map(transformJoinedResult);
// const baseSelectStatement = knex("restaurants as r")
//   .select()
//   .innerJoin("users as u", "r.owner", "u.id")
//   .innerJoin("files as f", "r.profilePicture", "f.id")
//   .options({ nestTables: true });

// export const findRestaurants = (select = null) => {
//   return knex("restaurants").select(select);
// };
// export const findRestaurantById = id =>
//   baseSelectStatement
//     .where("r.id", id)
//     .then(transformJoinedResultMultiple)
//     .then(results => results[0]);
// export const findRestaurantByOwnerId = ownerId =>
//   baseSelectStatement
//     .where("r.owner", ownerId)
//     .then(transformJoinedResultMultiple);
// export const createRestaurant = data => {
//   const id = nanoid();

//   return knex("restaurants")
//     .insert({ ...data, id })
//     .then(() => id);
// };
// export const deleteRestaurantById = id =>
//   knex("restaurants").where("id", id).delete();
// export const updateRestaurantById = (id, data) =>
//   knex("restaurants").where("id", id).update(data);
