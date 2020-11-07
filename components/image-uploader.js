import React from "react";
import { FileField } from "./field";

export default function ImageUploader({ name, id, onChange, ...props }) {
  const [preview, setPreview] = React.useState(null);

  function setPreviewImage(e) {
    const $this = e.target;

    if ($this.files.length === 0) return;

    const fileReader = new FileReader();

    fileReader.onload = e => {
      setPreview(e.target.result);
    };

    fileReader.readAsDataURL($this.files[0]);
  }

  function handleChange(e) {
    setPreviewImage.call(this, e);

    if (typeof onChange === "function") {
      onChange.call(this, e);
    }
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="rounded-full bg-gray-200 bg-contain bg-center flex items-center justify-center p-4 text-gray-500 mb-4 cursor-"
        style={{
          width: `100px`,
          height: `100px`,
          backgroundImage: preview ? `url(${preview})` : undefined,
        }}
      >
        {!preview ? `Tap here to add picture` : null}
      </label>
      <FileField
        name={name}
        id={id}
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
    </div>
  );
}
