import classnames from "classnames";
import React from "react";
import PropTypes from "prop-types";
import Link from "./link";

const normalizePath = path => {
  if (typeof path === "string") {
    return { name: path, path: "/" + path };
  }

  return path;
};

const getPathArray = path => {
  if (Array.isArray(path)) return path.map(normalizePath);
  if (typeof path === "string") return path.split("/").map(normalizePath);

  throw new TypeError(
    `'path' parameter must either be string or array of string or object`
  );
};

export default function NavPath({ path, className, ...props }) {
  const pathArray = getPathArray(path);

  return (
    <div
      className={classnames("p-4 text-gray-700 text-sm", className)}
      {...props}
    >
      {pathArray.map((path, index) => (
        <React.Fragment key={path.name}>
          {index === pathArray.length - 1 ? (
            <span className="mr-1">{path.name}</span>
          ) : (
            <Link href={path.path} className="mr-1">
              <span>{path.name}</span>
            </Link>
          )}
          {index === pathArray.length - 1 ? null : (
            <span className="mr-1">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

NavPath.propTypes = {
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
        }),
      ])
    ),
  ]).isRequired,
};
