import nanoid from "../helpers/nanoid";
import knex from "../knex";

export const findMenus = (select = null) => {
  return knex("menus").select(select);
};

export const findMenuById = id => knex("menus").select().where("id", id);
export const findMenuByOwnerId = ownerId =>
  knex("menus").select().where("owner", ownerId);
export const createMenu = data => {
  const id = nanoid();

  return knex("menus")
    .insert({ ...data, id })
    .then(() => id);
};
export const deleteMenuById = id => knex("menus").where("id", id).delete();
export const updateMenuById = (id, data) =>
  knex("menus").where("id", id).update(data);
