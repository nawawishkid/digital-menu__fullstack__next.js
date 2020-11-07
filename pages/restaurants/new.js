import Axios from "axios";
import { Form, Formik } from "formik";
import * as yup from "yup";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { withAuth } from "../../components/auth";
import Button from "../../components/button";
import Field from "../../components/field";
import ImageUploader from "../../components/image-uploader";

function NewRestaurant() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Create new restaurant</title>
      </Head>
      <center>
        <Formik
          initialValues={{ name: "", bio: "", profilePicture: "" }}
          validationSchema={yup.object().shape({
            name: yup
              .string()
              .required()
              .trim()
              .matches(
                /^[a-zA-Zก-๙]+\w*/,
                `Name must begins with [a-z, A-Z, ก-๙]`
              ),
            bio: yup.string().nullable().trim(),
            profilePicture: yup.mixed().required(),
          })}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) =>
              formData.append(key, value)
            );

            for (let key of formData.entries()) {
              console.log(key);
            }
            // return;
            Axios.post("/api/restaurants", formData, { timeout: 5000 })
              .then(res => {
                console.log(`res: `, res);
                router.push("/restaurants/" + res.data.restaurantId);
              })
              .catch(console.log)
              .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="w-full sm:w-1/2 lg:w-1/4 p-4">
              <ImageUploader
                name="profilePicture"
                id="profilePicture"
                onChange={e => {
                  console.log(`name: `, e.target.name);
                  console.log(`file: `, e.target.files[0]);
                  setFieldValue(e.target.name, e.target.files[0]);
                }}
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

export default withAuth()(NewRestaurant);
