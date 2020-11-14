import useMenu from "../hooks/use-menu";
import Button from "./button";
import DishCard from "./dish-card";
import Link from "./link";
import NoDish from "./no-dish";

export default function DishList({ dishes, restaurantId }) {
  const [menu] = useMenu(restaurantId);

  return dishes.length ? (
    <div>
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
    <NoDish restaurantId={restaurant.id} />
  );
}
