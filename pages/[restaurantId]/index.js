import React from "react";
import NavPath from "../../components/nav-path";
import DishList from "../../components/dish-list";
import useMenu from "../../hooks/use-menu";
import useDishes from "../../hooks/use-dishes";
import RestaurantProfileHeader from "../../components/restaurant-profile-header";

const RestaurantNotFound = () => {
  return <p>Restaurant not found :p</p>;
};

const RestaurantProfile = ({ restaurant }) => {
  const [menu] = useMenu(restaurant.id);
  const [dishes] = useDishes(menu && menu.id);

  return (
    <>
      <NavPath
        path={[{ name: "Home", path: "/restaurants" }, `@${restaurant.id}`]}
      />
      <RestaurantProfileHeader restaurant={restaurant} isEditable />
      <div className="p-4">
        {dishes === null ? (
          <p>Loading...</p>
        ) : (
          <center>
            <DishList dishes={dishes} restaurantId={restaurant.id} />
          </center>
        )}
      </div>
    </>
  );
};

export default function Restaurant({ restaurant }) {
  return restaurant ? (
    <RestaurantProfile restaurant={restaurant} />
  ) : (
    <RestaurantNotFound />
  );
}

export async function getServerSideProps({ params }) {
  const getRestaurantsServiceInstance = require("../../helpers/get-restaurants-service-instance")
    .default;
  const restaurantsService = getRestaurantsServiceInstance();
  let [restaurant] = await restaurantsService.findRestaurantById(
    params.restaurantId.slice(1)
  );

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
