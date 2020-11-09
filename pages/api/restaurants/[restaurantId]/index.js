import * as yup from "yup";
import nc from "../../../../helpers/next-connect";
import validate from "../../../../middlewares/validate";
import authenticate from "../../../../middlewares/authenticate";
import { findRestaurantById } from "../../../../services/restaurants";

const getRestaurantById = async (req, res, next) => {
  const { restaurantId } = req.query;
  const restaurant = await findRestaurantById(restaurantId);

  if (!restaurant)
    return next({
      statusCode: 404,
      data: {
        message: `Restaurant with id '${restaurantId}' could not be found`,
      },
    });

  res.json({ restaurant });
};

export default nc()
  .use(authenticate())
  .get(
    validate(
      "query",
      yup.object().shape({ restaurantId: yup.string().required() })
    ),
    getRestaurantById
  );
