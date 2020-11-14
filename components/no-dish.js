import useMenu from "../hooks/use-menu";
import Button from "./button";
import Link from "./link";

export default function NoDish({ restaurantId }) {
  const [menu] = useMenu(restaurantId);

  return menu ? (
    <div>
      <div
        className="rounded-full bg-gray-500 mb-8"
        style={{ width: `100px`, height: `100px` }}
      ></div>
      <p>You currently have no dish.</p>
      <p className="mb-8">Create one below</p>
      <Link href={`/@${restaurantId}/menus/${menu.id}/new-dish`}>
        <Button>Create a dish</Button>
      </Link>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
