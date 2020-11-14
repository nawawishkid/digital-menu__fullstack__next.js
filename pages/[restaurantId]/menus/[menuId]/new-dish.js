import { useRouter } from "next/router";
import * as yup from "yup";
import { Form, Formik, Field as FormikField } from "formik";
import React from "react";
import Axios from "axios";
import FormAction from "../../../../components/form-action";
import Field, { BaseField } from "../../../../components/field";
import IngredientsField from "../../../../components/ingredient-field";

const PicturesSlider = () => "this is pictures slider";
const validationSchema = yup.object().shape({
  name: yup.string().required().trim(),
  price: yup.number().required(),
  description: yup.string().trim(),
  pictures: yup.array(yup.mixed()).required(),
  cuisine: yup.number(),
  ingredients: yup.array(
    yup
      .mixed()
      .test(
        `isStringOrInteger`,
        `Ingredient must be either string or integer`,
        value => typeof value === "string" || Number.isInteger(value)
      )
  ),
  menu: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9]{8}$/),
  restaurantId: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9]{8}$/),
});
const initialValues = {
  name: "",
  price: "",
  description: "",
  pictures: [],
  cuisine: "",
  ingredients: [],
  menu: undefined,
  restaurantId: undefined,
};
const handleSubmit = router => values => {
  console.log(`submitted values: `, values);
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v =>
        formData.append(key === "ingredients" ? "ingredients[]" : key, v)
      );
    } else {
      formData.append(key, value);
    }
  });

  return Axios.post(`/api/dishes`, formData, { timeout: 3000 })
    .then(res => {
      console.log(`res.data: `, res.data);
      router.push("/" + router.query.restaurantId);
    })
    .catch(err => console.log(`err: `, err.response ? err.response.data : err));
};

export default function NewDish() {
  const router = useRouter();
  const [cuisines, setCuisines] = React.useState(null);
  const [previewPictures, setPreviewPictures] = React.useState(null);

  React.useEffect(() => {
    Axios.get("/api/cuisines")
      .then(res => setCuisines(res.data.cuisines))
      .catch(console.log);
  }, []);

  const { menuId, restaurantId } = router.query;

  console.log(`router.query: `, router.query);

  if (!menuId || !restaurantId) return <p>Loading...</p>;

  initialValues.menu = menuId;
  initialValues.restaurantId = restaurantId.slice(1);

  const readFile = file => {
    const fr = new FileReader();

    fr.onload = e =>
      setPreviewPictures(
        Array.isArray(previewPictures)
          ? [...previewPictures, e.target.result]
          : e.target.result
      );

    fr.readAsDataURL(file);
  };
  const filesToPriviewPictures = e => {
    const { target } = e;

    if (!target.files.length) return;

    Object.values(target.files).forEach(readFile);
  };

  console.log(`cuisines: `, cuisines);
  // console.log(`previewPictures: `, previewPictures);
  console.log(`initialValues: `, initialValues);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit(router)}
    >
      {({ isSubmitting, setFieldValue, values }) =>
        console.log(`values: `, values) || (
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
                  onChange={e => {
                    filesToPriviewPictures(e);
                    setFieldValue("pictures", Object.values(e.target.files));
                  }}
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
              {cuisines === null ? null : (
                <div>
                  <p className="font-bold mb-2">Cuisine</p>
                  <Field name="cuisine" component="select">
                    {cuisines.map(cuisine => (
                      <option value={cuisine.id}>{cuisine.name}</option>
                    ))}
                  </Field>
                </div>
              )}
              <div>
                <p className="font-bold mb-2">Ingredients</p>
                <IngredientsField
                  ingredients={values.ingredients}
                  isEditable
                  name="ingredients"
                />
              </div>
              <FormAction isSubmitting={isSubmitting} />
            </div>
          </Form>
        )
      }
    </Formik>
  );
}
