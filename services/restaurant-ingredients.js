import knex from "../knex";

export const findRestaurantIngredients = (select = null) => {
  return knex("restaurant_ingredients").select(select);
};
export const findRestaurantIngredientById = id =>
  knex("restaurant_ingredients")
    .where("id", id)
    .then(results => results[0]);
export const findRestaurantIngredientsByRestaurantId = restaurantId =>
  knex("restaurant_ingredients").where("restaurant", restaurantId);
export const createRestaurantIngredient = data =>
  knex("restaurant_ingredients").insert(data);
export const deleteRestaurantIngredientById = id =>
  knex("restaurant_ingredients").where("id", id).delete();
export const updateRestaurantIngredientById = (id, data) =>
  knex("restaurant_ingredients").where("id", id).update(data);
