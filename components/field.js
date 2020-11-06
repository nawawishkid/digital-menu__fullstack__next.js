import { ErrorMessage, Field as FormikField } from "formik";
import React from "react";

const Field = props => (
  <div className="mb-4">
    <FormikField {...props} />
    <ErrorMessage
      name={props.name}
      component="div"
      className="text-red-500 mt-2"
    />
  </div>
);

export default Field;
