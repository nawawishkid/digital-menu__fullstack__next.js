import Repository from "./repository";

export default class RestaurantIngredientRepository extends Repository {
  constructor(knex) {
    super(knex, "restaurant_ingredients");
  }
}
