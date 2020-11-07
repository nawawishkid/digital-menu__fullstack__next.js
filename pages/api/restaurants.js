import { promises as fs } from "fs";
import path from "path";
import nc from "next-connect";
import * as yup from "yup";
import authenticate from "../../middlewares/authenticate";
import multipartFormData from "../../middlewares/multipart-form-data";
import validate from "../../middlewares/validate";
import {
  createRestaurant,
  findRestaurantByOwnerId,
  updateRestaurantById,
} from "../../services/restaurants";
import mkdirp from "mkdirp";

const getRestaurants = async (req, res) => {
  const restaurants = await findRestaurantByOwnerId(req.user.id);

  res.status(200).json({ restaurants });
};

/**
 * @todo Handle file upload
 */
const createRestaurants = async (req, res) => {
  const profilePictureFile = req.files.profilePicture;
  const data = {
    ...req.body,
    owner: req.user.id,
    profilePicture: profilePictureFile.path,
  };

  // const restaurantId = 123;
  const restaurantId = await createRestaurant(data);
  const [fileName, fileExtension] = profilePictureFile.name.split(".");
  const directory = path.join(`files/restaurants/`, restaurantId);
  const profilePicturePath = `${directory}/${fileName}-${Date.now()}.${fileExtension}`;

  await mkdirp(directory);
  await fs.rename(profilePictureFile.path, profilePicturePath);
  await updateRestaurantById(restaurantId, {
    profilePicture: profilePicturePath,
  });

  res.status(201).json({ restaurantId });
};

export default nc({
  onError: (err, req, res) => {
    console.log(err);
    res.status(err.status || 500).json({ error: err.name ? err : err.error });
  },
})
  .use(authenticate())
  .get(getRestaurants)
  .use(multipartFormData())
  .use((req, res, next) => {
    console.log(`body: `, req.body);
    next();
  })
  .post(
    validate(
      "body",
      yup.object().shape({
        name: yup
          .string()
          .required()
          .trim()
          .matches(/^[a-zA-Zก-๙]+\w*/, `Name must begins with a-z, A-Z, ก-๙`),
        bio: yup.string().nullable().trim(),
      })
    ),
    validate(
      "files",
      yup.object().shape({ profilePicture: yup.mixed().required() })
    ),
    createRestaurants
  );

export const config = {
  api: {
    bodyParser: false,
  },
};
