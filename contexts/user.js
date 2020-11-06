import Axios from "axios";
import React from "react";

export const UserContext = React.createContext();
export const UserProvider = ({ children, user: initialUser = null }) => {
  const [user, setUser] = React.useState(initialUser);
  const [loaded, setLoaded] = React.useState(false);
  const fetchUser = () => {
    if (loaded) setLoaded(false);

    return Axios.get("/api/users")
      .then(res => setUser(res.data.user))
      .catch(console.log)
      .finally(() => setLoaded(true));
  };

  React.useEffect(() => {
    if (initialUser) return;
    fetchUser();
  }, []);

  console.log(`user: `, user);

  return (
    <UserContext.Provider value={[user, setUser, fetchUser]}>
      {loaded ? children : <p>Loading...</p>}
    </UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext);
