import { ErrorMessage, Field as FormikField } from "formik";
import React from "react";

export const BaseField = ({ name, children }) => (
  <div className="mb-4">
    {children}
    <ErrorMessage name={name} component="div" className="text-red-500 mt-2" />
  </div>
);
const Field = props => (
  <BaseField name={props.name}>
    <FormikField {...props} />
  </BaseField>
);

export const FileField = props => (
  <BaseField name={props.name}>
    <input type="file" {...props} />
  </BaseField>
);

export default Field;
