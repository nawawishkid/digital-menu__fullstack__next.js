import S3 from "aws-sdk/clients/s3";
import { promises as fs } from "fs";
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

const getRestaurants = async (req, res) => {
  const restaurants = await findRestaurantByOwnerId(req.user.id);

  res.status(200).json({ restaurants });
};

/**
 * @todo Handle file upload
 */
const createRestaurants = async (req, res) => {
  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const profilePictureFile = req.files.profilePicture;
  const data = {
    ...req.body,
    owner: req.user.id,
    profilePicture: profilePictureFile.path,
  };

  const restaurantId = await createRestaurant(data);
  const [fileName, fileExtension] = profilePictureFile.name.split(".");
  const newFileName = `${fileName}-${Date.now()}.${fileExtension}`;
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: await fs.readFile(profilePictureFile.path),
    Key: `restaurants/${restaurantId}/${newFileName}`,
    ContentType: profilePictureFile.type,
  };

  const uploadedData = await new Promise((resolve, reject) => {
    s3.upload(s3Params, (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });

  await updateRestaurantById(restaurantId, {
    profilePicture: uploadedData.Location,
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
  .post(
    multipartFormData(),
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
