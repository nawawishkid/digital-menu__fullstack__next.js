import Axios from "axios";
import React from "react";

export const RestaurantsContext = React.createContext();
export const RestaurantsProvider = ({
  children,
  restaurants: initialRestaurants = [],
}) => {
  const [restaurants, setRestaurants] = React.useState(initialRestaurants);

  React.useEffect(() => {
    if (initialRestaurants && initialRestaurants.length) return;

    Axios.get("/api/restaurants")
      .then(res => setRestaurants(res.data.restaurants))
      .catch(console.log);
  }, []);

  console.log(`restaurants: `, restaurants);

  return (
    <RestaurantsContext.Provider value={[restaurants, setRestaurants]}>
      {children}
    </RestaurantsContext.Provider>
  );
};

export const useRestaurants = () => React.useContext(RestaurantsContext);
