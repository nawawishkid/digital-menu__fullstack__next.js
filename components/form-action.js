import React from "react";
import Button from "./button";
import CancelButton from "./cancel-button";

export default function FormAction({ isSubmitting }) {
  return (
    <div className="flex justify-end mt-8 items-center">
      <CancelButton className="mr-4" />
      <Button type="submit" disabled={isSubmitting}>
        Save
      </Button>
    </div>
  );
}
