import knex from "../knex";

export const findFiles = (select = null) => {
  return knex("files").select(select);
};

export const findFileById = id => knex("files").select().where("id", id);
export const findFileByOwnerId = ownerId =>
  knex("files").select().where("owner", ownerId);
export const addFile = data => knex("files").insert(data);
export const deleteFileById = id => knex("files").where("id", id).delete();
export const updateFileById = (id, data) =>
  knex("files").where("id", id).update(data);
