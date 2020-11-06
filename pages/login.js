import Axios from "axios";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import React from "react";
import { useRouter } from "next/router";
import Button from "../components/button";
import Logo from "../components/logo";
import Field from "../components/field";
import Link from "../components/link";
import { withAuth } from "../components/auth";
import { useUser } from "../contexts/user";

const NoEmail = ({ countdown = 5 }) => {
  const [second, setSecond] = React.useState(countdown);
  const router = useRouter();

  React.useEffect(() => {
    let sec = second;
    const handle = setInterval(() => {
      if (sec === 0) {
        clearInterval(handle);
        return router.push("/otp");
      }
      sec--;

      setSecond(sec);
    }, 1000);
  }, []);

  return (
    <h3>
      It looks like you haven't given your email to us yet. We redirect you to
      email page in <span>{second}</span> seconds.
    </h3>
  );
};

function Login({ email }) {
  const router = useRouter();
  const [_, __, fetchUser] = useUser();

  if (!email) {
    return <NoEmail />;
  }

  return (
    <center>
      <Logo className="mb-8" />

      <Formik
        initialValues={{ email, otp: "" }}
        validationSchema={Yup.object({
          otp: Yup.number()
            .required("Required")
            .positive()
            .integer()
            .min(100000)
            .max(999999),
        })}
        onSubmit={(values, actions) => {
          Axios.post("/api/sessions", values)
            .then(res => {
              console.log("res.data: ", res.data);
              fetchUser();
              router.push("/restaurants");
            })
            .catch(error => {
              console.log(`error data: `, error.response.data);
              console.log(error);
            })
            .finally(() => actions.setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4 text-gray-700">
              <p>We've sent an OTP to your email: {email}</p>
              <p>
                Please check your email then copy the OTP and paste it below
              </p>
            </div>
            <Field
              type="number"
              name="otp"
              placeholder="Paste your OTP from email here"
            />
            <Button type="submit" disabled={isSubmitting}>
              Log in
            </Button>
            <p>
              Need new OTP?{" "}
              <Link href="/otp">
                <span>Request a new one</span>
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </center>
  );
}

export default withAuth({ publicOnly: true, redirect: "/restaurants" })(Login);

export async function getServerSideProps({ req, res }) {
  const { COOKIES_KEY } = process.env;

  if (!COOKIES_KEY) throw new Error("COOKIES_KEYS env var is required");

  const Cookies = require("cookies");
  const cookies = new Cookies(req, res, { keys: [COOKIES_KEY] });
  const email = cookies.get("email", { signed: true }) || null;

  return { props: { email } };
}
