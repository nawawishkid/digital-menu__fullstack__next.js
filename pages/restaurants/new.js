import { ErrorMessage, Field as FormikField, Form, Formik } from "formik";
import Head from "next/head";
import React from "react";
import Button from "../../components/button";

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

export default function NewRestaurant() {
  return (
    <>
      <Head>
        <title>Create new restaurant</title>
      </Head>
      <center>
        <Formik
          initialValues={{ name: "", description: "", profilePicture: null }}
          validate={values => {
            console.log(`validating: `, values);
            const errors = {};

            if (!values.name) {
              errors.name = `Name is required!`;
            } else if (!/^[a-zA-Zก-๙]+\w*/.test(values.name)) {
              errors.name = `Name must begins with a-z, A-Z, ก-๙`;
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="w-full sm:w-1/2 lg:w-1/4 p-4">
              <label
                htmlFor="profilePicture"
                className="rounded-full bg-gray-200 flex items-center justify-center p-4 text-gray-500 mb-4 cursor-"
                style={{ width: `100px`, height: `100px` }}
              >
                Tap here to add picture
              </label>
              <Field
                name="profilePicture"
                id="profilePicture"
                type="file"
                className="hidden"
              />
              <Field
                name="name"
                type="text"
                placeholder="Your rest. name here"
                className="w-full"
              />
              <Field
                name="bio"
                component="textarea"
                placeholder="(optional) Your restaurant bio here..."
                className="w-full"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </center>
    </>
  );
}
