import { ER_DUP_ENTRY } from "mysql/lib/protocol/constants/errors";
import * as yup from "yup";
import nc from "../../helpers/next-connect";
import authenticate from "../../middlewares/authenticate";
import multipartFormData from "../../middlewares/multipart-form-data";
import validate from "../../middlewares/validate";
import getDishesServiceInstance from "../../helpers/get-dishes-service-instance";

const getDishes = async (req, res) => {
  const { menuId } = req.query;
  const dishesService = getDishesServiceInstance();
  const dishes = await dishesService.findDishesByMenuId(menuId);

  res.status(200).json({ dishes });
};

const createDish = async (req, res, next) => {
  const data = {
    ...req.body,
    pictures: req.files.pictures,
    userId: req.user.id,
  };

  console.log(`data: `, data);

  try {
    const dishesService = getDishesServiceInstance();
    const createdDishId = await dishesService.createDish(data);

    res.status(201).json({ createdDishId });
  } catch (error) {
    if (error.errno && error.errno === ER_DUP_ENTRY) {
      /**
       * @TODO Use http-status-code library to avoid magic value
       * @see https://github.com/prettymuchbryce/http-status-codes
       */
      next({
        statusCode: 409,
        data: { message: `Dish name '${data.name}' already exists` },
      });
    } else {
      next(error);
    }
  }
};

export default nc()
  .use(authenticate())
  .get(
    validate(
      "query",
      yup
        .object()
        .shape({
          menuId: yup
            .string()
            .required()
            .matches(/^[a-zA-Z0-9]{8}$/),
        })
        .required()
    ),
    getDishes
  )
  .post(
    multipartFormData(),
    validate(
      "files",
      yup.object().shape({
        pictures: yup
          .array(
            yup
              .object()
              .shape({
                name: yup.string().required(),
                path: yup.string().required(),
                size: yup.number().required().integer(),
                type: yup
                  .string()
                  .required()
                  .matches(/^image\/.+/),
              })
              .required()
          )
          .required(),
      })
    ),
    validate(
      "body",
      yup.object().shape({
        name: yup.string().required().trim(),
        description: yup.string().trim(),
        price: yup.number().required(),
        cuisine: yup
          .number()
          .integer()
          .transform((cv, ov) => {
            if (typeof ov === "string" && ov === "") return null;

            return cv;
          })
          .nullable(),
        ingredients: yup.array(yup.number()),
      })
    ),
    createDish
  );

export const config = {
  api: {
    bodyParser: false,
  },
};
