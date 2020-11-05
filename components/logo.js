import React from "react";

const Logo = ({ className, style, ...props }) => {
  return (
    <div
      {...props}
      className={
        "rounded-full bg-red-500 flex items-center justify-center " + className
      }
      style={{ width: `100px`, height: `100px`, ...style }}
    >
      This is logo
    </div>
  );
};

export default Logo;
