import React from "react";
import Axios from "axios";

export default function useMenu(restaurantId) {
  const [menu, setMenu] = React.useState(null);

  React.useEffect(() => {
    Axios.get(`/api/restaurants/${restaurantId}/menus`, { timeout: 3000 })
      .then(res => setMenu(res.data.menus[0]))
      .catch(console.log);
  }, []);

  return [menu, setMenu];
}
