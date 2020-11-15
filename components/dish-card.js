import Link from "./link";

export default function DishCard({ id, name, price, pictures, restaurantId }) {
  const pagePath = `/@${restaurantId}/dishes/${id}`;

  return (
    <div
      className="rounded bg-white shadow-md w-1/2 mb-4"
      style={{ width: `calc(50% - 4px)` }}
    >
      <Link href={pagePath}>
        <img
          src={pictures[0].path}
          className="w-full"
          style={{ height: `124px` }}
        />
      </Link>
      <div className="p-2">
        <p className="bold">
          <Link href={pagePath} className="no-underline">
            {name}
          </Link>
        </p>
        <p>
          <small>฿ {price}</small>
        </p>
      </div>
    </div>
  );
}
