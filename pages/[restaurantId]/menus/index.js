/**
 * Since we currently do not support multiple menus per restaurants but our database schema is capable of doing it,
 * we have to redirect users from this menus listing page back to the restaurant profile page.
 *
 * This page is just redirecting users back
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
