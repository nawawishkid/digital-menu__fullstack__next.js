import { findUserById } from "../services/users";
import makeCookies from "../helpers/make-cookies";

export default () => async (req, res, next) => {
  const cookies = makeCookies(req, res);
  const userId = cookies.get("u", { signed: true });

  console.log(`userId: `, userId);
  if (!userId) return res.status(401).end();

  const [user] = await findUserById(userId);

  if (!user)
    return next({
      statusCode: 401,
      data: { message: `User id '${userId}' is not found` },
    });

  req.user = user;

  next();
};
