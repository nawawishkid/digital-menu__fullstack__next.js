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

const RestaurantItem = ({ name }) => {
  return <div>{name}</div>;
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
      <ul>
        {restaurants.map(rest => (
          <li key={rest.id}>
            <RestaurantItem {...rest} />
          </li>
        ))}
      </ul>
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
