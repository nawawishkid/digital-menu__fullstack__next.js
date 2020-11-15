import * as yup from "yup";

export default yup.object().shape({
  name: yup.string().required(),
  path: yup.string().required(),
  size: yup.number().required().integer(),
  type: yup
    .string()
    .required()
    .matches(/^image\/.+/),
});
