import makeCookies from "../../helpers/make-cookies";
import knex from "../../knex";

const createSession = async (req, res) => {
  const cookies = makeCookies(req, res);
  const email = cookies.get("email", { signed: true });
  let user, storedOtp;

  if (!email) {
    return res.status(422).json({ error: { message: `Invalid session` } });
  }

  console.log(`email: `, email);

  if (!req.body.otp) {
    return res.status(422).json({ error: { message: `OTP is required` } });
  }
  console.log(`req.body.otp: `, req.body.otp);

  try {
    const results = await knex.select().from("users").where("email", email);

    console.log(`user results: `, results);

    user = results[0];
  } catch (error) {
    console.log(`error getting user: `, error);

    return res.status(500).json({ error });
  }

  if (!user) {
    console.log("no user");
    return res.status(422).json({
      error: { message: `User with the email: '${email}' is not found` },
    });
  }

  try {
    const results = await knex
      .select()
      .from("otps")
      .where("user", user.id)
      .andWhere(knex.raw("expiresAt > NOW()"))
      .orderBy("id", "desc");

    console.log(`otp results: `, results);

    storedOtp = results[0];
  } catch (error) {
    console.log(`error getting stored OTP: `, error);

    return res.status(500).json({ error });
  }

  if (!storedOtp) {
    console.log(`no stored otp`);
    return res.status(401).json({
      error: {
        message: `No valid OTP for the email: '${email}'. This either means there is literally no OTP for the email or the OTP for the email has already expired`,
      },
    });
  }

  if (storedOtp.password === req.body.otp.toString()) {
    cookies.set("u", user.id, { signed: true });
    cookies.set("email");
    cookies.set("email.sig");

    // console.log(`cookie email: `, cookies.get("email", { signed: true }));

    res.status(201).end();
  } else {
    console.log(`otp is incorrect`);
    res.status(401).json({ error: { message: `OTP is incorrect` } });
  }
};

const deleteSession = (req, res) => {
  const cookies = makeCookies(req, res);
  const userId = cookies.get("u", { signed: true });

  if (!userId) {
    return res.status(401).end();
  }

  cookies.set("u");
  cookies.set("u.sig");

  res.status(204).end();
};

export default (req, res) => {
  switch (req.method) {
    case "POST":
      return createSession(req, res);

    case "DELETE":
      return deleteSession(req, res);

    default:
      return res.status(422).end();
  }
};
