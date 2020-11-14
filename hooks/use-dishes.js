import React from "react";
import Axios from "axios";

export default function useDishes(menuId) {
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
}
