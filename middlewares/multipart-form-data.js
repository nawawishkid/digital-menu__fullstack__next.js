import * as yup from "yup";
import formidable from "formidable";
import validate from "./validate";

// const form = formidable({ multiples: true });

export default () => async (req, res, next) => {
  const form = formidable({ multiples: true });
  // await validate(
  //   "headers",
  //   yup.object().shape({
  //     "content-type": yup
  //       .string()
  //       .required()
  //       .matches(/^multipart\/form-data;.+/),
  //   })
  // )(req, res);
  console.log("helllllllllll");
  console.log(`content type: `, req.headers["content-type"]);
  console.log(
    `ok: `,
    req.headers["content-type"].indexOf("multipart/form-data;") === -1
  );
  const contentType = req.headers["content-type"];

  if (contentType && contentType.indexOf("multipart/form-data;") === -1)
    return next();

  console.log(`parsing...`);
  form.parse(req, (err, fields, files) => {
    console.log(`form err: `, err);
    console.log(`form fields: `, fields);
    console.log(`form files: `, files);
    if (err) return next(err);

    req.body = fields;
    req.files = files;

    console.log(`req.body: `, req.body);
    next();
  });
};
