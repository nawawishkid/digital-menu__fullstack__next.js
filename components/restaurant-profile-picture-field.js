import { ErrorMessage, useField } from "formik";
import React from "react";
import useFilesToImageUrls from "../hooks/use-files-to-image-urls";

export default function RestaurantProfilePictureField({
  name,
  imageUrl: initImageUrl = null,
  ...props
}) {
  const [imageUrls, setFiles] = useFilesToImageUrls(
    initImageUrl ? [initImageUrl] : null
  );
  const [_, __, helpers] = useField(name);

  return (
    <div {...props}>
      <label
        htmlFor="profilePicture"
        style={{
          width: `100px`,
          height: `100px`,
          backgroundImage: imageUrls ? `url(${imageUrls[0]})` : undefined,
        }}
        className="rounded-full bg-gray-200 bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 text-gray-500 mb-4 cursor-"
      >
        {imageUrls === null ? `Tap here to add picture` : null}
      </label>
      <input
        type="file"
        name={name}
        id={name}
        accept="image/*"
        className="hidden"
        onChange={e => {
          setFiles(e.target.files[0]);
          helpers.setValue(e.target.files[0]);
          if (typeof inputOnChange === "function") {
            inputOnChange(e);
          }
        }}
      />
      <ErrorMessage name={name} component="div" />
    </div>
  );
}
