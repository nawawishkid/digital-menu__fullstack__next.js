import { Icon } from "@iconify/react";
import searchIcon from "@iconify/icons-ei/search";
import filterIcon from "@iconify/icons-bi/filter";
import useMenu from "../hooks/use-menu";
import Button from "./button";
import DishCard from "./dish-card";
import Link from "./link";
import NoDish from "./no-dish";

export default function DishList({ dishes, restaurantId }) {
  const [menu] = useMenu(restaurantId);

  return dishes.length ? (
    <div>
      <div className="flex justify-end items-center">
        <Icon
          icon={searchIcon}
          width="2em"
          height="2em"
          className="text-gray-700"
        />
        <Icon
          icon={filterIcon}
          width="2em"
          height="2em"
          className="text-gray-700 ml-2"
        />
      </div>
      <div className="flex flex-wrap justify-between mb-8">
        {dishes.map(dish => (
          <DishCard {...dish} key={dish.id} restaurantId={restaurantId} />
        ))}
      </div>
      {menu ? (
        <Link href={`/@${restaurantId}/menus/${menu.id}/new-dish`}>
          <Button>Create another dish</Button>
        </Link>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  ) : (
    <NoDish restaurantId={restaurantId} />
  );
}
