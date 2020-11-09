import nanoid from "../helpers/nanoid";
import knex from "../knex";

export const findMenus = (select = null) => {
  return knex("menus").select(select);
};

export const findMenuById = id =>
  knex("menus")
    .select()
    .where("id", id)
    .then(results => results[0]);
export const findMenusByOwnerId = ownerId =>
  knex("menus").select().where("ownedBy", ownerId);
export const createMenu = data => {
  const id = nanoid();

  return knex("menus")
    .insert({ ...data, id })
    .then(() => id);
};
export const deleteMenuById = id => knex("menus").where("id", id).delete();
export const updateMenuById = (id, data) =>
  knex("menus").where("id", id).update(data);
