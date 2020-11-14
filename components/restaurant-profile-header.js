import React from "react";
import { Icon } from "@iconify/react";
import bxsPencil from "@iconify/icons-bx/bxs-pencil";
import Link from "./link";

const EditRestaurantProfileIcon = () => {
  return (
    <div
      className="rounded-full bg-gray-400 flex justify-center items-center"
      style={{ width: `16px`, height: `16px` }}
    >
      <Icon icon={bxsPencil} style={{ width: `8px`, height: `8px` }}>
        Edit icon
      </Icon>
    </div>
  );
};

export default function RestaurantProfileHeader({
  restaurant,
  isEditable = false,
}) {
  return (
    <div className="p-4">
      <center className="p-2 mb-16">
        <img
          src={restaurant.profilePicture}
          className="rounded-full mb-4"
          style={{ width: `100px`, height: `100px` }}
        />
        {isEditable ? (
          <div className="flex justify-center items-center mb-4">
            <h1>{restaurant.name}</h1>
            <Link href={`/@${restaurant.id}/edit`} className="ml-2">
              <EditRestaurantProfileIcon />
            </Link>
          </div>
        ) : (
          <h1 className="mb-4">{restaurant.name}</h1>
        )}
        <p>{restaurant.bio || <span className="text-gray-400">No bio</span>}</p>
      </center>
    </div>
  );
}
