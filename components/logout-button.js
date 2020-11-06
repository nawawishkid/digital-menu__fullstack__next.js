import Axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useUser } from "../contexts/user";
import Button from "./button";

export default function LogoutButton() {
  const [_, setUser] = useUser();
  const router = useRouter();
  const handleClick = () => {
    Axios.delete("/api/sessions")
      .then(res => {
        if (res.status === 204) {
          setUser(null);
          router.push("/");
        }
      })
      .catch(console.log);
  };

  return <Button onClick={handleClick}>Log out</Button>;
}
