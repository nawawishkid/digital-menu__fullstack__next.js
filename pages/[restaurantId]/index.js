import React from "react";
import Link from "../../components/link";
import Button from "../../components/button";
import { findRestaurantById } from "../../services/restaurants";
import Axios from "axios";

const NoDish = ({ restaurantId }) => {
  const [menu, setMenu] = React.useState(null);

  React.useEffect(() => {
    Axios.get(`/api/restaurants/${restaurantId}/menus`, { timeout: 3000 })
      .then(res => setMenu(res.data.menus[0]))
      .catch(console.log);
  }, []);

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

export default function Restaurant({ restaurant }) {
  return restaurant ? (
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
      <div>
        {restaurant.dishes ? (
          restaurant.dishes.map(dish => <p>{dish.name}</p>)
        ) : (
          <center>
            <NoDish restaurantId={restaurant.id} />
          </center>
        )}
      </div>
    </div>
  ) : null;
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
