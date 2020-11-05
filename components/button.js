import React from "react";
import classnames from "classnames";

const Button = ({ className, ...props }) => {
  return (
    <button
      className={classnames(
        "rounded py-2 px-4 bg-gray-500 disabled:opacity-75 focus:border-blue-500 hover:bg-white",
        className
      )}
      {...props}
    />
  );
};

export default Button;
