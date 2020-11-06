import "../styles/tailwind.css";
import { UserProvider } from "../contexts/user";
import { RestaurantsProvider } from "../contexts/restaurants";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <RestaurantsProvider>
        <Component {...pageProps} />
      </RestaurantsProvider>
    </UserProvider>
  );
}

export default MyApp;
