import Head from "next/head";
import React from "react";
import axios from "axios";
import Button from "../../components/button";
import Link from "../../components/link";

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

export default function Restaurants() {
  const [restaurants, setRestaurants] = React.useState(null);
  let result;

  React.useEffect(() => {
    axios
      .get("/api/restaurants")
      .then(res => setRestaurants(res.data.restaurants))
      .catch(err => console.log(err) || setRestaurants(0));
  });

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
      <div className="p-4">
        <h1 className="mb-16">Your restaurants</h1>
        <center>
          <div className="w-full sm:w-1/2">{result}</div>
        </center>
      </div>
    </>
  );
}
