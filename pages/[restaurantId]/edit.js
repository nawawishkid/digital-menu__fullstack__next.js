import React from "react";
import { useRouter } from "next/router";
import Axios from "axios";
import { Form, Formik } from "formik";
import RestaurantProfilePictureField from "../../components/restaurant-profile-picture-field";
import FormAction from "../../components/form-action";
import updateRestaurantProfileValidator from "../../yup-validators/update-restaurant-profile-validator";
import Field from "../../components/field";

const useRestaurant = restaurantId => {
  const [restaurant, setRestaurant] = React.useState(null);

  React.useEffect(() => {
    if (!restaurantId) return;

    Axios.get("/api/restaurants/" + restaurantId)
      .then(res => setRestaurant(res.data.restaurant))
      .catch(() => setRestaurant(0));
  }, [restaurantId]);

  return restaurant;
};

export default function EditRestaurant() {
  const router = useRouter();
  const { restaurantId } = router.query;
  const restaurant = useRestaurant(restaurantId ? restaurantId.slice(1) : null);

  if (restaurant === null) return <p>Loading...</p>;
  if (restaurant === 0)
    return <p>An error occurred, please contact the developer.</p>;

  const { profilePicture, createdAt, owner, ...initialValues } = restaurant;

  initialValues.profilePicture = profilePicture.id;

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={updateRestaurantProfileValidator}
        onSubmit={values => {
          const fd = new FormData();

          Object.entries(values).forEach(([key, value]) =>
            fd.append(key, value)
          );

          return (
            Axios.put(`/api/restaurants/${restaurant.id}`, fd, {
              timeout: 3000,
            })
              .then(() => router.push("/" + restaurantId))
              /**
               * @TODO Handle the error
               */
              .catch(console.log)
          );
        }}
      >
        {({ isSubmitting, values }) =>
          console.log(`values: `, values) || (
            <Form className="w-full sm:w-1/2 lg:w-1/4 p-4">
              <Field type="hidden" name="id" />
              <RestaurantProfilePictureField
                name="profilePicture"
                className="flex justify-center items-center"
                imageUrl={profilePicture.path}
              />
              <h1>
                <Field
                  name="name"
                  type="text"
                  placeholder="Your rest. name here"
                  className="w-full text-gray-600 text-center mb-4"
                />
              </h1>
              <Field
                name="bio"
                component={({ field, form, ...props }) => (
                  <textarea {...field} {...props} rows="5" />
                )}
                placeholder="(optional) Your restaurant bio here..."
                className="w-full text-gray-600"
              />
              <FormAction isSubmitting={isSubmitting} />
            </Form>
          )
        }
      </Formik>
    </>
  );
}
