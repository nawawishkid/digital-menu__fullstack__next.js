import * as yup from "yup";
import nc from "../../../../helpers/next-connect";
import validate from "../../../../middlewares/validate";
import authenticate from "../../../../middlewares/authenticate";
import getRestaurantsServiceInstance from "../../../../helpers/get-restaurants-service-instance";
import updateRestaurantProfileValidator from "../../../../yup-validators/update-restaurant-profile-validator";
import multipartFormData from "../../../../middlewares/multipart-form-data";

const getRestaurantById = async (req, res, next) => {
  const { restaurantId } = req.query;
  const restaurantsService = getRestaurantsServiceInstance();
  const [restaurant] = await restaurantsService.findRestaurantById(
    restaurantId
  );

  if (!restaurant)
    return next({
      statusCode: 404,
      data: {
        message: `Restaurant with id '${restaurantId}' could not be found`,
      },
    });

  res.json({ restaurant });
};

const updateRestaurant = (req, res, next) => {
  const { restaurantId } = req.query;
  const restaurantsService = getRestaurantsServiceInstance();

  restaurantsService
    .updateRestaurant(restaurantId, req.user.id, req.body)
    .then(() => res.status(200).json({ updatedRestaurantId: restaurantId }))
    /**
     * @TODO Add custom exception to provide meaningful error
     */
    .catch(err => next(err));
};

const deleteRestaurant = (req, res, next) => {
  const { restaurantId } = req.query;
  const restaurantsService = getRestaurantsServiceInstance();

  restaurantsService
    .deleteRestaurant(restaurantId)
    .then(() => res.status(204).end())
    .catch(next);
};

export default nc()
  .use(authenticate())
  .use(
    validate(
      "query",
      yup.object().shape({ restaurantId: yup.string().required() })
    )
  )
  .get(getRestaurantById)
  .put(
    multipartFormData(),
    (req, res, next) => {
      req.body.profilePicture = req.files.profilePicture;
      next();
    },
    validate("body", updateRestaurantProfileValidator),
    updateRestaurant
  )
  .delete(deleteRestaurant);

export const config = {
  api: {
    bodyParser: false,
  },
};
