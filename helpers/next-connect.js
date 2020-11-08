import nc from "next-connect";
import handleError from "../middlewares/handle-error";

export default options =>
  nc({
    onError: handleError,
    ...options,
  });
