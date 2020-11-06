import Cookies from "cookies";

const { COOKIES_KEY } = process.env;

if (!COOKIES_KEY) throw new Error("COOKIES_KEY env. var is required");

export default (req, res, options = {}) =>
  new Cookies(req, res, { keys: [COOKIES_KEY], ...options });
