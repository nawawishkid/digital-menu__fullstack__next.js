import Repository from "./repository";

export default class DishIngredientRepository extends Repository {
  constructor(knex) {
    super(knex, "dish_ingredients");
  }
}
