import querystring from "querystring";
import Cookies from "cookies";
import rn from "random-number";
import Axios from "axios";
import knex from "../../knex";

// const Cookies = require("cookies");
// const keys = [process.env.COOKIES_KEY];
const {
  MAILGUN_BASE_URL,
  MAILGUN_DOMAIN_NAME,
  MAILGUN_API_KEY,
  EMAIL_FROM,
  COOKIES_KEY,
} = process.env;

console.log({
  MAILGUN_BASE_URL,
  MAILGUN_DOMAIN_NAME,
  MAILGUN_API_KEY,
  EMAIL_FROM,
  COOKIES_KEY,
});

if (
  !MAILGUN_BASE_URL ||
  !MAILGUN_DOMAIN_NAME ||
  !MAILGUN_API_KEY ||
  !EMAIL_FROM ||
  !COOKIES_KEY
)
  throw new Error(
    `These env vars are required: MAILGUN_BASE_URL, MAILGUN_DOMAIN_NAME, EMAIL_FROM`
  );

const randomNumber = rn.generator({ min: 100000, max: 999999, integer: true });
const otpLifetime = parseInt(process.env.OTP_LIFETIME);

function createOTP() {
  return randomNumber().toString();
}

export default async (req, res) => {
  if (!req.body.email) {
    return res.status(422).json({ error: { message: `Email is required` } });
  }

  const { email } = req.body;
  const cookies = new Cookies(req, res, { keys: [COOKIES_KEY] });
  const [user] = await knex.select().from("users").where("email", email);
  let userId;

  if (!user) {
    try {
      userId = await knex.insert({ email }).into("users");
      console.log(`inserted user id: `, userId);
    } catch (error) {
      console.log(`insert user error: `, error);
      return res.status(500).json({ error });
    }
  } else {
    userId = user.id;
  }

  const otp = createOTP();

  try {
    await knex
      .insert({
        password: otp,
        user: userId,
        expiresAt: new Date(Date.now() + otpLifetime * 1000)
          .toISOString()
          .replace("Z", "")
          .replace("T", " "),
      })
      .into("otps");
  } catch (error) {
    console.log(`insert otp error: `, error);
  }

  const mailgunUrl = MAILGUN_BASE_URL + "/" + MAILGUN_DOMAIN_NAME + "/messages";

  if (process.env.NODE_ENV === "production") {
    try {
      await Axios.post(
        mailgunUrl,
        querystring.stringify({
          from: EMAIL_FROM,
          to: email,
          subject: `Your login code`,
          text: otp,
        }),
        { auth: { username: "api", password: MAILGUN_API_KEY } }
      );
    } catch (error) {
      console.log(`error sending otp email: `, error);
      return res.status(500).json({ error });
    }
  }

  cookies.set("email", email, { signed: true });

  res.statusCode = 201;
  res.end();
  // const cookies = new Cookies(req, res, { keys });

  // cookies.set("u", userId);

  // if (userId) {
  //   try {
  //     const user = await knex.select().from("users").where("id", userId);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
};
