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

## Dev Notes

- Next.js API does not support `multipart/form-data` content type by default. You have to handle this yourself e.g. create parser middleware using `formidable` library. You also need to disable the default body parser provided by Next.js for your parser to work. See [https://chadalen.com/blog/how-to-add-multipart-form-middleware-in-nextjs-and-use-it-in-an-api-route.md/](https://chadalen.com/blog/how-to-add-multipart-form-middleware-in-nextjs-and-use-it-in-an-api-route.md/)
- You should use `next-connect` library to handle API request middlewares the same way as `express` does.
- Using `yup` for data validation for both HTML form (using `formik`) and HTTP request is quite easy
