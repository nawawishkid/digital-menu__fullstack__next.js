import Head from "next/head";
import Link from "../components/link";
import Credit from "../components/credit";
import Logo from "../components/logo";
import Button from "../components/button";

export default function Home() {
  return (
    <>
      <Head>
        <title>Digital menu landing page</title>
      </Head>
      <center>
        <Logo />
        <p>Are you a restaurant owner?</p>
        <p>Sign up for your online menu below.</p>
        <Link href="/login">
          <Button>Create your menu</Button>
        </Link>
        <Credit />
      </center>
    </>
  );
}
