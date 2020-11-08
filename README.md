# Digital Menu

## A full-stack Next.js project

---

## Resources

ER diagram: [https://dbdiagram.io/d/5f9d27e13a78976d7b79ebe6](https://dbdiagram.io/d/5f9d27e13a78976d7b79ebe6)

---

## Requirements

### Functional requirements

- [ ] Users are web admin, restaurant owner, and restaurant visitor.
- [x] Restaurant owners can create many restaurants.
- [x] A restaurant can have a profile picture added by its owner.
- [x] A restaurant can have bio added by its owner.
- [ ] Restaurants can have only one menu created by its owner.
- [ ] A menu lists many dishes.
- [ ] A menu must have a currency for its dishes specified by its owner.
- [ ] A dish contains its name, price, pictures, ingredients, cuisine, and description. Created by the restaurant owner.
- [ ] A menu can have zero or many groups of dishes created by the restaurant owner.
- [ ] Visitors can filter the dishes of a restaurant's menu by its price, ingredients, and cuisine.
- [ ] Visitors can search for dishes within a menu by typing keywords.
- [x] Visitors can become a restaurant owner by signing up using their email address.
- [ ] Web admin can add/update/delete ingredients.
- [ ] Web admin can add/update/delete cuisines.
- [ ] Web admin can see all restaurants.

---

## Notes to self

- Next.js API does not support `multipart/form-data` content type by default. You have to handle this yourself e.g. create parser middleware using `formidable` library. You also need to disable the default body parser provided by Next.js for your parser to work. See [https://chadalen.com/blog/how-to-add-multipart-form-middleware-in-nextjs-and-use-it-in-an-api-route.md/](https://chadalen.com/blog/how-to-add-multipart-form-middleware-in-nextjs-and-use-it-in-an-api-route.md/)
- Using `next-connect` library to handle API requests middlewares the same way as `express` does.
- Using `yup` for data validation for both HTML form (using `formik`) and the HTTP request is quite easy
- Uploading files to AWS S3: [https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/](https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/)
- The default `Content-Type` HTTP header of the uploaded files in S3 is `binary/octet-stream` which hint web browsers to open download dialog instead of displaying the image. You have to set parameter `ContentType` of the `upload()` method of the SDK to the type of the image so that the browser displays it correctly.
- Spend too much time on OTP login mechanism and files uploading.
- `cookies` library will store information directly in the HTTP cookies, not just a session ID.
- Set `ACL` key in S3 param object to `public-read` to enable public access of the file. Otherwise, the file isn't accessible from public. See [https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property)
- Set `nestTables` option of `knex` query builder to `true` when joining multiple tables to get result as object containing results from each joined table. See [https://github.com/knex/knex/issues/882#issuecomment-176802754](https://github.com/knex/knex/issues/882#issuecomment-176802754)
