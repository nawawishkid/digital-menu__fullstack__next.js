import * as yup from "yup";
import nc from "../../../../helpers/next-connect";
import authenticate from "../../../../middlewares/authenticate";
import validate from "../../../../middlewares/validate";
import { findRestaurantIngredientsByRestaurantId } from "../../../../services/restaurant-ingredients";

const getIngredients = async (req, res) => {
  const { restaurantId } = req.query;
  const ingredients = await findRestaurantIngredientsByRestaurantId(
    restaurantId
  );

  res.json({ ingredients });
};
const addIngredients = (req, res) => {};

export default nc()
  .use(authenticate())
  .use(
    validate(
      "query",
      yup.object().shape({ restaurantId: yup.string().required() })
    )
  )
  .get(getIngredients)
  .post(addIngredients);
