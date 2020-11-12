import RestaurantsService from "../services/restaurants";
import knex from "../knex";
import RestaurantRepository from "../repositories/restaurant";
import RestaurantIngredientRepository from "../repositories/restaurant-ingredient";
import FileRepository from "../repositories/file";
import MenuRepository from "../repositories/menu";
import getS3Instance from "./get-s3-instance";

let restaurantsService;

export default () => {
  if (!restaurantsService) {
    restaurantsService = new RestaurantsService(
      new RestaurantRepository(knex),
      new RestaurantIngredientRepository(knex),
      new FileRepository(knex),
      new MenuRepository(knex),
      getS3Instance()
    );
  }

  return restaurantsService;
};
