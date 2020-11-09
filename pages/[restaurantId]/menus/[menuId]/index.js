/**
 * Since we currently do not support multiple menus per restaurants but our database schema is capable of doing it,
 * we have to redirect users from this menu information page back to the restaurant profile page
 * as if there no such menu, only restaurant and its dishes.
 *
 * This page is just redirecting users to the restaurant profile page
 */
import React from "react";
import { useRouter } from "next/router";

export default function Menus({ restaurantId }) {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/" + restaurantId);
  }, []);

  return null;
}

export async function getServerSideProps({ params }) {
  return { props: { restaurantId: params.restaurantId } };
}
