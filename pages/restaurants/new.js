import Axios from "axios";
import { Form, Formik } from "formik";
import * as yup from "yup";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { withAuth } from "../../components/auth";
import Button from "../../components/button";
import Field from "../../components/field";

const initialValues = { name: "", bio: "", profilePicture: "" };
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required()
    .trim()
    .matches(/^[a-zA-Zก-๙]+\w*/, `Name must begins with [a-z, A-Z, ก-๙]`),
  bio: yup.string().nullable().trim(),
  profilePicture: yup.mixed().required(),
});
const handleSubmit = router => (values, actions) => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => formData.append(key, value));
  Axios.post("/api/restaurants", formData, { timeout: 5000 })
    .then(res => {
      console.log(`res: `, res);
      router.push("/@" + res.data.restaurantId);
    })
    .catch(console.log)
    .finally(() => actions.setSubmitting(false));
};
const readFile = (file, callback) => {
  const fr = new FileReader();

  fr.onload = callback;

  fr.readAsDataURL(file);
};
const handleFiles = callback => e => {
  const { target } = e;

  if (!target.files.length) return;

  Object.values(target.files).forEach(callback);
};

function NewRestaurant() {
  const router = useRouter();
  const [previewPicture, setPreviewPicture] = React.useState(null);
  const readFileCallback = e => setPreviewPicture(e.target.result);
  const handleFilesCallback = file => readFile(file, readFileCallback);

  return (
    <>
      <Head>
        <title>Create new restaurant</title>
      </Head>
      <center>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit(router)}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="w-full sm:w-1/2 lg:w-1/4 p-4">
              <div>
                <label
                  htmlFor="profilePicture"
                  style={{
                    width: `100px`,
                    height: `100px`,
                    backgroundImage: previewPicture
                      ? `url(${previewPicture})`
                      : undefined,
                  }}
                  className="rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 text-gray-500 mb-4 cursor-"
                >
                  {previewPicture ? null : `Tap here to add picture`}
                </label>
                <input
                  type="file"
                  name="profilePicture"
                  id="profilePicture"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    handleFiles(handleFilesCallback)(e);
                    setFieldValue("profilePicture", e.target.files[0]);
                  }}
                />
              </div>
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

export default withAuth()(NewRestaurant);
