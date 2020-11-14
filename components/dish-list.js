import DishCard from "./dish-card";
import NoDish from "./no-dish";

export default function DishList({ dishes, restaurantId }) {
  return dishes.length ? (
    <div className="flex flex-wrap justify-between">
      {dishes.map(dish => (
        <DishCard {...dish} key={dish.id} restaurantId={restaurantId} />
      ))}
    </div>
  ) : (
    <NoDish restaurantId={restaurant.id} />
  );
}
