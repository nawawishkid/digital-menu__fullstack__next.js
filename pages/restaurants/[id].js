import React from "react";
import { findRestaurantById } from "../../services/restaurants";

export default function Restaurant({ restaurant }) {
  return restaurant ? (
    <div>
      <h1>{restaurant.name}</h1>
    </div>
  ) : null;
}

export async function getServerSideProps({ params }) {
  let [restaurant] = await findRestaurantById(params.id);

  if (restaurant) {
    restaurant = JSON.parse(JSON.stringify(restaurant));
  } else {
    restaurant = null;
  }
  /**
   * @see https://github.com/vercel/next.js/issues/11993
   */
  return { props: { restaurant } };
}
