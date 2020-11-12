import * as yup from "yup";
import nc from "../../../helpers/next-connect";
import authenticate from "../../../middlewares/authenticate";
import multipartFormData from "../../../middlewares/multipart-form-data";
import validate from "../../../middlewares/validate";
import getRestaurantsServiceInstance from "../../../helpers/get-restaurants-service-instance";

const getRestaurants = async (req, res) => {
  const restaurantsService = getRestaurantsServiceInstance();
  const restaurants = await restaurantsService.findRestaurantByOwnerId(
    req.user.id
  );

  res.status(200).json({ restaurants });
};

/**
 * @todo Handle file upload
 */
const createRestaurants = async (req, res) => {
  const restaurantsService = getRestaurantsServiceInstance();
  const profilePicture = req.files.profilePicture;
  const restaurantData = {
    ...req.body,
    owner: req.user.id,
    profilePicture,
  };

  const restaurantId = await restaurantsService.createRestaurant(
    restaurantData
  );

  res.status(201).json({ restaurantId });
};

export default nc()
  .use(authenticate())
  .get(getRestaurants)
  .post(
    multipartFormData(),
    validate(
      "body",
      yup.object().shape({
        name: yup
          .string()
          .required()
          .trim()
          .matches(/^[a-zA-Zก-๙]+\w*/, `Name must begins with a-z, A-Z, ก-๙`),
        bio: yup.string().nullable().trim(),
      })
    ),
    validate(
      "files",
      yup.object().shape({
        profilePicture: yup
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
          .required(),
      })
    ),
    createRestaurants
  );

export const config = {
  api: {
    bodyParser: false,
  },
};
