import * as yup from "yup";
import nc from "../../../../helpers/next-connect";
import validate from "../../../../middlewares/validate";
import authenticate from "../../../../middlewares/authenticate";
import { findMenusByOwnerId } from "../../../../services/menus";

const getRestaurantMenus = async (req, res, next) => {
  const { restaurantId } = req.query;
  const menus = await findMenusByOwnerId(restaurantId);

  if (Array.isArray(menus) && menus.length === 0)
    return next({
      statusCode: 404,
      data: {
        message: `Menus of the restaurant with '${restaurantId}' id could not be found.`,
      },
    });

  res.json({ menus });
};

export default nc()
  .use(authenticate())
  .get(
    validate(
      "query",
      yup.object().shape({ restaurantId: yup.string().required() })
    ),
    getRestaurantMenus
  );
