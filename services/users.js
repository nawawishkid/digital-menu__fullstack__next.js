import knex from "../knex";

export const findUsers = (select = null) => {
  return knex("users").select(select);
};

export const findUserById = id => knex("users").select().where("id", id);
export const findUserByEmail = email =>
  knex("users").select().where("email", email);
export const createUser = data => knex("users").insert(data);
export const deleteUserById = id => knex("users").where("id", id).delete();
export const updateUserById = (id, data) =>
  knex("users").where("id", id).update(data);
