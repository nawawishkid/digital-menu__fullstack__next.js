import knex from "../../knex";

export default async (req, res) => {
  console.log(`req.cookies: `, req.cookies);
  const userId = req.cookies.u;

  if (!userId) {
    return res.status(401).end();
  }

  try {
    const [user] = await knex.select().from("users").where("id", userId);

    res.status(200).json({ user });
  } catch (error) {
    console.log(`get user error: `, error);

    res.status(500).json({ error });
  }
};
