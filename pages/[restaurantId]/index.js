import React from "react";
import Link from "../../components/link";
import Button from "../../components/button";
import { findRestaurantById } from "../../services/restaurants";
import Axios from "axios";

const useMenu = restaurantId => {
  const [menu, setMenu] = React.useState(null);

  React.useEffect(() => {
    Axios.get(`/api/restaurants/${restaurantId}/menus`, { timeout: 3000 })
      .then(res => setMenu(res.data.menus[0]))
      .catch(console.log);
  }, []);

  return [menu, setMenu];
};
const useDishes = menuId => {
  const [dishes, setDishes] = React.useState(null);

  React.useEffect(() => {
    if (!menuId) return;

    Axios.get(`/api/dishes?menuId=${menuId}`)
      .then(res =>
        setDishes(Array.isArray(res.data.dishes) ? res.data.dishes : [])
      )
      .catch(console.log);
  }, [menuId]);

  return [dishes, setDishes];
};

const NoDish = ({ restaurantId }) => {
  const [menu] = useMenu(restaurantId);

  return menu ? (
    <div>
      <div
        className="rounded-full bg-gray-500 mb-8"
        style={{ width: `100px`, height: `100px` }}
      ></div>
      <p>You currently have no dish.</p>
      <p className="mb-8">Create one below</p>
      <Link href={`/@${restaurantId}/menus/${menu.id}/new-dish`}>
        <Button>Create a dish</Button>
      </Link>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

const DishCard = ({ id, name, price, pictures, restaurantId }) => {
  const pagePath = `/@${restaurantId}/dishes/${id}`;

  return (
    <div
      className="rounded bg-white shadow-md w-1/2 mb-4"
      style={{ width: `calc(50% - 4px)` }}
    >
      <Link href={pagePath}>
        <img src={pictures[0]} className="w-full" style={{ height: `124px` }} />
      </Link>
      <div className="p-2">
        <p className="bold">
          <Link href={pagePath} className="no-underline">
            {name}
          </Link>
        </p>
        <p>
          <small>฿ {price}</small>
        </p>
      </div>
    </div>
  );
};

const RestaurantNotFound = () => {
  return <p>Restaurant not found :p</p>;
};

const RestaurantProfile = ({ restaurant }) => {
  const [menu] = useMenu(restaurant.id);
  const [dishes] = useDishes(menu && menu.id);
  let dishResult;

  if (dishes === null) {
    dishResult = <p>Loading...</p>;
  } else {
    dishResult = (
      <center>
        {dishes.length ? (
          <div className="flex flex-wrap justify-between">
            {dishes.map(dish => (
              <DishCard {...dish} key={dish.id} restaurantId={restaurant.id} />
            ))}
          </div>
        ) : (
          <NoDish restaurantId={restaurant.id} />
        )}
      </center>
    );
  }

  return (
    <div className="p-4">
      <center className="p-2 mb-16">
        <img
          src={restaurant.profilePicture}
          className="rounded-full mb-4"
          style={{ width: `100px`, height: `100px` }}
        />
        <h1 className="mb-4">{restaurant.name}</h1>
        <p>{restaurant.bio || <span className="text-gray-400">No bio</span>}</p>
      </center>
      {dishResult}
    </div>
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
  let restaurant = await findRestaurantById(params.restaurantId.slice(1));

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
