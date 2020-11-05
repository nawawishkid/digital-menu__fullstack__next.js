import React from "react";
import Button from "../components/button";
import Logo from "../components/logo";

export default function Login() {
  return (
    <>
      <center>
        <Logo className="mb-8" />
        <form>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Your email here"
              className="rounded bg-gray-200 py-2 px-4"
            />
          </div>
          <Button>Log in</Button>
        </form>
      </center>
    </>
  );
}
