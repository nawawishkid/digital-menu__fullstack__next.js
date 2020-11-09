import nanoid from "../helpers/nanoid";
import knex from "../knex";

const transformJoinedResult = ({ r, u, f }) => {
  delete u.createdAt;

  return { ...r, profilePicture: f.path, owner: u };
};
const transformJoinedResultMultiple = rows => rows.map(transformJoinedResult);
const baseSelectStatement = knex("restaurants as r")
  .select()
  .innerJoin("users as u", "r.owner", "u.id")
  .innerJoin("files as f", "r.profilePicture", "f.id")
  .options({ nestTables: true });

export const findRestaurants = (select = null) => {
  return knex("restaurants").select(select);
};
export const findRestaurantById = id =>
  baseSelectStatement
    .where("r.id", id)
    .then(transformJoinedResultMultiple)
    .then(results => results[0]);
export const findRestaurantByOwnerId = ownerId =>
  baseSelectStatement
    .where("r.owner", ownerId)
    .then(transformJoinedResultMultiple);
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
