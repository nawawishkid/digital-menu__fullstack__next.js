import { ErrorMessage, Field as FormikField } from "formik";
import React from "react";
import classnames from "classnames";

export const BaseField = ({ name, children, className, ...props }) => (
  <div className={classnames("mb-4", className)} {...props}>
    {children}
    <ErrorMessage name={name} component="div" className="text-red-500 mt-2" />
  </div>
);
const Field = props => (
  <BaseField name={props.name}>
    <FormikField {...props} />
  </BaseField>
);

export default Field;
