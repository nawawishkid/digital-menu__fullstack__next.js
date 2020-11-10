import S3 from "aws-sdk/clients/s3";
import DishesService from "../services/dishes";
import DishRepository from "../repositories/dish";
import FileRepository from "../repositories/file";
import DishPictureRepository from "../repositories/dish-picture";
import knex from "../knex";

let dishesService;

export default function getDishesServiceInstance() {
  if (!dishesService) {
    dishesService = new DishesService(
      new DishRepository(knex),
      new FileRepository(knex),
      new S3({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }),
      new DishPictureRepository(knex)
    );
  }

  return dishesService;
}
