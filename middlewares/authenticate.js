import { findUserById } from "../services/users";
import makeCookies from "../helpers/make-cookies";

export default () => async (req, res, next) => {
  const cookies = makeCookies(req, res);
  const userId = cookies.get("u", { signed: true });

  if (!userId) return res.status(401).end();

  const [user] = await findUserById(userId);

  req.user = user;

  next();
};
