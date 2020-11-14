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

## Todos

- [x] Create a new menu automatically when creating a new restaurant.
- [x] Define page path for menu
- [x] Add menu id in the 'new-dish' form
- [ ] Handle unauthenticated OTP login in front-end
- [ ] Make first user an admin??
- [x] Finish new dish creation
  - [x] Upload picture files to S3
  - [x] Insert files
  - [x] Insert dishes
  - [x] Insert dish_pictures
  - [x] Insert ingredients
  - [x] Insert dish_ingredients
- [ ] Finish restaurant profile update
- [ ] Should separate repositories from services
- [ ] Finish dish detail page
  - [ ] Picture slider
- [ ] Not-found pages
  - [ ] Restaurant
  - [ ] Dish
- [ ] Add app navigation
- [ ] Auth for each page

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
- JS `formData.append(key, value)` method add data (`value`) to the given `key`. If the key already exists, it appends the value to the existing key. This means you can set value multiple times with the same key because it literally `append` to the key, not overriding it e.g. suppose you have an array of files you want to add to a form data, you can do `files.forEach(file => formData.append('files', file))` to append all files to the same key `files`. For overriding, use `set(key, value)` instead. See [https://developer.mozilla.org/en-US/docs/Web/API/FormData/append](https://developer.mozilla.org/en-US/docs/Web/API/FormData/append)
- `yup` casts empty string to `number` as `NaN`. You need to call `.transform()` method to transform the empty string to `null`. See [https://github.com/jquense/yup/issues/298](https://github.com/jquense/yup/issues/298)
- `formidable` automatically transforms an array of files in multipart/form-data to an array when `multiples` option is `true`. But not for normal form fields, you have to end an array field name with `[]` to signal the `formidable` that this field should be transformed to an array.
- `formidable` has a bug that does not transform a form field with the name ends with `[]` to an array. Using `@canary` version (`yarn add formidable@canary`) helps! See [https://github.com/node-formidable/formidable/issues/633](https://github.com/node-formidable/formidable/issues/633)
- `docker-compose up -d` gives an error (Windows 10 Home):

  ```bash
  $ docker-compose up -d
  Building nextjs
  <3>init: (26011) ERROR: UtilConnectToInteropServer:300: connect failed 2
  Traceback (most recent call last):
    File "docker/credentials/store.py", line 80, in _execute
    File "subprocess.py", line 411, in check_output
    File "subprocess.py", line 512, in run
  subprocess.CalledProcessError: Command '['/mnt/c/Program Files/Docker/Docker/resources/bin/docker-credential-desktop.exe', 'list']' returned non-zero exit status 1.

  During handling of the above exception, another exception occurred:

  Traceback (most recent call last):
    File "bin/docker-compose", line 3, in <module>
    File "compose/cli/main.py", line 67, in main
    File "compose/cli/main.py", line 126, in perform_command
    File "compose/cli/main.py", line 1070, in up
    File "compose/cli/main.py", line 1066, in up
    File "compose/project.py", line 615, in up
    File "compose/service.py", line 362, in ensure_image_exists
    File "compose/service.py", line 1125, in build
    File "docker/api/build.py", line 261, in build
    File "docker/api/build.py", line 308, in _set_auth_headers
    File "docker/auth.py", line 302, in get_all_credentials
    File "docker/credentials/store.py", line 71, in list
    File "docker/credentials/store.py", line 93, in _execute
  docker.credentials.errors.StoreError: Credentials store docker-credential-desktop.exe exited with "".
  [26008] Failed to execute script docker-compose
  ```

  Then I found this thread [https://github.com/docker/for-mac/issues/3805](https://github.com/docker/for-mac/issues/3805). It's for Mac, obviously. But I tried editing `~/.docker/config.json` by replacing `"desktop.exe"` to `""` and it worked!

  ```bash
  $ cat ~/.docker/config.json
  {
    "credsStore": "desktop.exe",
    "experimental": "enabled"
  }
  ```

- Everything worked as expected in local development but after I tried deploying in the local Docker container, all image files uploaded to S3 are corrupted, like they are partially uploaded.

![https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1937fec2-5b8d-4805-ae62-e695da19b7fe/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201114%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201114T021957Z&X-Amz-Expires=86400&X-Amz-Signature=50847d947d5175026004680b9215b5a7a17a8810bb4e3c2fa6c8ad36020f73fd&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1937fec2-5b8d-4805-ae62-e695da19b7fe/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201114%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201114T021957Z&X-Amz-Expires=86400&X-Amz-Signature=50847d947d5175026004680b9215b5a7a17a8810bb4e3c2fa6c8ad36020f73fd&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)
