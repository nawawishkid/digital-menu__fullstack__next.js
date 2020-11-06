import Axios from "axios";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import React from "react";
import { useRouter } from "next/router";
import Button from "../components/button";
import Logo from "../components/logo";
import Field from "../components/field";
import { withAuth } from "../components/auth";

function OTP() {
  const router = useRouter();

  const handleSubmit = (values, actions) => {
    Axios.post("/api/otps", { email: values.email })
      .then(() => {
        actions.setStatus({ feedback: `We've sent you an email!` });
        router.push("/login");
      })
      .catch(
        error =>
          console.log(error) ||
          actions.setStatus({
            feedback: `An error occurred, please contact the developer!`,
          })
      )
      .finally(() => {
        actions.resetForm();
        actions.setSubmitting(false);
      });
  };

  return (
    <>
      <center>
        <Logo className="mb-8" />
        <Formik
          initialValues={{ email: "" }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email(`Invalid email address format`)
              .required(`Required`),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form>
              <div className="mb-4">
                <Field
                  type="email"
                  name="email"
                  placeholder="Your email here"
                  className="rounded bg-gray-200 py-2 px-4"
                />
                {status && status.feedback && <p>{status.feedback}</p>}
              </div>
              {isSubmitting && <p>Loading...</p>}
              <Button disabled={isSubmitting} type="submit">
                Request OTP
              </Button>
            </Form>
          )}
        </Formik>
      </center>
    </>
  );
}

export default withAuth({ publicOnly: true, redirect: "/restaurants" })(OTP);
