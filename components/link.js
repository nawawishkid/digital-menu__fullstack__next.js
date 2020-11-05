import React from "react";
import NextLink from "next/link";

const Link = ({ href, ...props }) => {
  return (
    <NextLink href={href}>
      <a {...props} />
    </NextLink>
  );
};

export default Link;
