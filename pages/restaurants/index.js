import Head from "next/head";
import React from "react";
import { withAuth } from "../../components/auth";
import Button from "../../components/button";
import Link from "../../components/link";
import LogoutButton from "../../components/logout-button";
import { useRestaurants } from "../../contexts/restaurants";

const NoRestaurant = () => {
  return (
    <div>
      <div
        className="rounded-full bg-gray-500 mb-8"
        style={{ width: `100px`, height: `100px` }}
      ></div>
      <p>You currently have no restaurant.</p>
      <p className="mb-32">Create one below</p>
      <Link href="/restaurants/new">
        <Button>Create restaurant</Button>
      </Link>
    </div>
  );
};

const RestaurantItem = ({ name, profilePicture, id }) => {
  return (
    <Link href={`@${id}`} className="no-underline">
      <div className="rounded p-4 flex justify-start bg-white shadow-sm mb-4">
        <img
          src={profilePicture.path}
          className="rounded-full"
          style={{ width: `64px`, height: `64px` }}
        />
        <span className="flex items-center ml-8">{name}</span>
      </div>
    </Link>
  );
};

function Restaurants() {
  const [restaurants] = useRestaurants();
  let result;

  if (restaurants === null) {
    result = <p>Loading...</p>;
  } else if (restaurants === 0) {
    result = <p>Error fetching restaurants</p>;
  } else if (Array.isArray(restaurants)) {
    result = restaurants.length ? (
      <div>
        <ul>
          {restaurants.map(rest => (
            <li key={rest.id}>
              <RestaurantItem {...rest} />
            </li>
          ))}
        </ul>
        <Link href="/restaurants/new">
          <Button>Create another restaurant</Button>
        </Link>
      </div>
    ) : (
      <NoRestaurant />
    );
  } else {
    result = <p>An error occurred, please contact the developer!</p>;
  }

  return (
    <>
      <Head>
        <title>Your restaurants</title>
      </Head>
      <LogoutButton />
      <div className="p-4">
        <h1 className="mb-16">Your restaurants</h1>
        <center>
          <div className="w-full sm:w-1/2">{result}</div>
        </center>
      </div>
    </>
  );
}

export default withAuth()(Restaurants);
