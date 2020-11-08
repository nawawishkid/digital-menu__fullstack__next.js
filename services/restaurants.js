import nanoid from "../helpers/nanoid";
import knex from "../knex";

export const findRestaurants = (select = null) => {
  return knex("restaurants").select(select);
};

export const findRestaurantById = id =>
  knex("restaurants").select().where("id", id);
export const findRestaurantByOwnerId = ownerId =>
  knex("restaurants as r")
    .select()
    .where("r.owner", ownerId)
    .innerJoin("users as u", "r.owner", "u.id")
    .innerJoin("files as f", "r.profilePicture", "f.id")
    .options({ nestTables: true })
    .then(rows =>
      rows.map(({ r, u, f }) => {
        delete u.createdAt;

        return { ...r, profilePicture: f.path, owner: u };
      })
    );
export const createRestaurant = data => {
  const id = nanoid();

  return knex("restaurants")
    .insert({ ...data, id })
    .then(() => id);
};
export const deleteRestaurantById = id =>
  knex("restaurants").where("id", id).delete();
export const updateRestaurantById = (id, data) =>
  knex("restaurants").where("id", id).update(data);
