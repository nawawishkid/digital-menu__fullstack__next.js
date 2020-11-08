import * as yup from "yup";
import { ErrorMessage, Form, Formik, Field as FormikField } from "formik";
import React from "react";
import Button from "../../../components/button";
import Field, { BaseField, FileField } from "../../../components/field";
import Axios from "axios";

const PicturesSlider = () => "this is pictures slider";
const initialValues = {
  name: "",
  price: "",
  description: "",
  pictures: [],
  cuisine: "",
  ingredients: [],
};
const validationSchema = yup.object().shape({
  name: yup.string().required().trim(),
  price: yup.number().required(),
  description: yup.string().trim(),
  pictures: yup.array(yup.mixed()).required(),
  cuisine: yup.number(),
  ingredients: yup.array(yup.number()),
});

export default function NewDish() {
  const [cuisines, setCuisines] = React.useState(null);
  const [previewPictures, setPreviewPictures] = React.useState(null);

  React.useEffect(() => {
    Axios.get("/api/cuisines")
      .then(res => setCuisines(res.data.cuisines))
      .catch(console.log);
  }, []);

  console.log(`cuisines: `, cuisines);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        console.log(`values: `, values);
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            {previewPictures && previewPictures.length ? (
              <PicturesSlider pictures={previewPictures} />
            ) : (
              <label
                htmlFor="pictures"
                className="w-full flex justify-center items-center bg-gray-200 text-gray-500"
                style={{ height: `240px` }}
              >
                Tap here to add picture
              </label>
            )}
            <BaseField name="pictures">
              <input
                type="file"
                name="pictures"
                id="pictures"
                accept="image/*"
                multiple
                className="hidden"
              />
            </BaseField>
          </div>
          <div className="p-4">
            <BaseField name="name">
              <h1>
                <FormikField
                  type="text"
                  name="name"
                  placeholder="Name here"
                  className="w-full"
                />
              </h1>
            </BaseField>
            <BaseField name="price">
              <h2>
                ฿{" "}
                <FormikField
                  type="number"
                  name="price"
                  placeholder="Price here"
                />
              </h2>
            </BaseField>
            <Field
              name="description"
              component="textarea"
              placeholder="Description here..."
              className="w-full"
            />
            <div>
              <p className="font-bold mb-2">Cuisine</p>
              <Field name="cuisine" component="select">
                {cuisines === null
                  ? `Loading...`
                  : cuisines.map(
                      cuisine =>
                        console.log(`cuisine: `, cuisine) || (
                          <option value={cuisine.id}>{cuisine.name}</option>
                        )
                    )}
              </Field>
            </div>
            <div>
              <p className="font-bold mb-2">Ingredients</p>
              <Field
                type="text"
                name="ingredients"
                placeholder="Type your ingredient and type enter"
                className="w-full"
              />
            </div>
            <div className="flex justify-end mt-8">
              <Button type="submit" disabled={isSubmitting}>
                Save
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
