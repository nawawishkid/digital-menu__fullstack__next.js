import Repository from "./repository";

export default class FileRepository extends Repository {
  constructor(knex) {
    super(knex, "files");
  }
}
