import { useRouter } from "next/router";
import React from "react";

export default function CancelButton(props) {
  const router = useRouter();

  return (
    <span {...props} onClick={() => router.back()}>
      Cancel
    </span>
  );
}
