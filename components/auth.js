import { useRouter } from "next/router";
import React from "react";
import { useUser } from "../contexts/user";

const verifyUser = (user, configs = {}) => {
  if (!user) return false;

  return Object.entries(configs).every(([key, value]) => {
    return user[key] === value;
  });
};

const defaultConfigs = {
  publicOnly: false,
  user: {},
  redirect: "/",
};

export const withAuth = (configs = {}) => Component => props => {
  return (
    <Auth {...{ ...defaultConfigs, ...configs }}>
      <Component {...props} />
    </Auth>
  );
};

export const Auth = ({ children, ...configs }) => {
  const router = useRouter();
  const [user] = useUser();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (configs.publicOnly) {
      if (user) return router.push(configs.redirect);
    } else {
      if (!verifyUser(user, configs.user)) return router.push(configs.redirect);
    }

    setReady(true);
  }, []);

  if (!ready) return <p>Loading...</p>;

  return <>{children}</>;
};
