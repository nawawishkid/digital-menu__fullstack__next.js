import * as yup from "yup";
import jsFileValidator from "./js-file-validator";

export default yup.object().shape({
  id: yup.string().required().trim(),
  name: yup
    .string()
    .required()
    .trim()
    .matches(/^[a-zA-Zก-๙]+\w*/, `Name must begins with [a-z, A-Z, ก-๙]`),
  bio: yup.string().nullable().trim(),
  profilePicture: yup
    .mixed()
    .required()
    .test("number or file", "${path} must be number or File", v =>
      yup
        .number()
        .integer()
        .isValid(v)
        .then(() => true)
        .catch(() =>
          jsFileValidator
            .isValid(v)
            .then(() => true)
            .catch(() => false)
        )
    ),
});
