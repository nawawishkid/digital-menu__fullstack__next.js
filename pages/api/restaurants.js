import knex from "../../knex";
import makeCookies from "../../helpers/make-cookies";

export default async (req, res) => {
  const cookies = makeCookies(req, res);
  const userId = cookies.get("u", { signed: true });

  if (!userId) return res.status(401).end();

  try {
    const restaurants = await knex
      .select()
      .from("restaurants")
      .where("owner", userId);

    res.status(200).json({ restaurants });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
};
