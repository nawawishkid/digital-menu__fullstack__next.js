import * as yup from "yup";
import nc from "../../../../helpers/next-connect";
import authenticate from "../../../../middlewares/authenticate";
import validate from "../../../../middlewares/validate";
import {
  createRestaurantIngredient,
  findRestaurantIngredientsByRestaurantId,
} from "../../../../services/restaurant-ingredients";

const getIngredients = async (req, res) => {
  const { restaurantId } = req.query;
  const ingredients = await findRestaurantIngredientsByRestaurantId(
    restaurantId
  );

  res.json({ ingredients });
};
const addIngredients = async (req, res) => {
  const { restaurantId } = req.query;
  const data = { ...req.body, restaurant: restaurantId };

  await createRestaurantIngredient(data);

  res.status(201).json({
    message: `Ingredient created`,
  });
};

export default nc()
  .use(authenticate())
  .use(
    validate(
      "query",
      yup.object().shape({ restaurantId: yup.string().required() })
    )
  )
  .get(getIngredients)
  .post(
    validate(
      "body",
      yup.object().shape({
        restaurant: yup.string().required(),
        name: yup.string().required(),
      })
    ),
    addIngredients
  );
