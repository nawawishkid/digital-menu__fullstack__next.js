import React from "react";

export default function DishProfile({ dish }) {
  return dish ? (
    <div>
      <div>
        {dish.pictures.map((pic, index) => (
          <img src={pic} key={index} />
        ))}
      </div>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="mb-2">{dish.name}</h1>
          <h2 className="mb-4">฿{dish.price}</h2>
          <p>{dish.description}</p>
        </div>
        {dish.cuisine ? (
          <div>
            <p className="bold">Cuisine</p>
            <p>{dish.cuisine}</p>
          </div>
        ) : null}
        {dish.ingredients ? (
          <div>
            <p className="bold">Ingredients</p>
            <div>{dish.ingredients.map(ingredient => null)}</div>
          </div>
        ) : null}
      </div>
    </div>
  ) : (
    <p>Dish not found</p>
  );
}

export async function getServerSideProps({ params }) {
  const getDishesServiceInstance = require("../../../helpers/get-dishes-service-instance")
    .default;
  const dishesService = getDishesServiceInstance();
  const { dishId } = params;
  let dish;

  if (!dishId) {
    dish = null;
  } else {
    const foundDish = await dishesService.findDishById(dishId);

    dish = !foundDish ? null : foundDish;
  }

  return { props: { dish } };
}
