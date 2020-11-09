import S3 from "aws-sdk/clients/s3";
import { promises as fs } from "fs";
import * as yup from "yup";
import nc from "../../../helpers/next-connect";
import authenticate from "../../../middlewares/authenticate";
import multipartFormData from "../../../middlewares/multipart-form-data";
import validate from "../../../middlewares/validate";
import { createMenu } from "../../../services/menus";
import {
  createRestaurant,
  findRestaurantByOwnerId,
  updateRestaurantById,
} from "../../../services/restaurants";
import { addFile } from "../../../services/files";

const getRestaurants = async (req, res) => {
  const restaurants = await findRestaurantByOwnerId(req.user.id);

  res.status(200).json({ restaurants });
};

/**
 * @todo Handle file upload
 */
const createRestaurants = async (req, res) => {
  const profilePictureFile = req.files.profilePicture;
  const restaurantData = {
    ...req.body,
    owner: req.user.id,
  };
  const restaurantId = await createRestaurant(restaurantData);
  const [fileName, fileExtension] = profilePictureFile.name.split(".");
  const newFileName = `${fileName}-${Date.now()}.${fileExtension}`;
  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: await fs.readFile(profilePictureFile.path),
    Key: `restaurants/${restaurantId}/${newFileName}`,
    ContentType: profilePictureFile.type,
    ACL: "public-read",
  };
  const uploadedData = await new Promise((resolve, reject) => {
    s3.upload(s3Params, (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
  const fileData = {
    name: newFileName,
    path: uploadedData.Location,
    type: profilePictureFile.type,
    size: profilePictureFile.size,
    addedBy: req.user.id,
  };
  const [fileId] = await addFile(fileData);

  await updateRestaurantById(restaurantId, {
    profilePicture: fileId,
  });

  const menuData = {
    name: "default",
    ownedBy: restaurantId,
    createdBy: req.user.id,
  };

  await createMenu(menuData);

  res.status(201).json({ restaurantId });
};

export default nc()
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
