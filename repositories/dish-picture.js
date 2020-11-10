import Repository from "./repository";

export default class DishPictureRepository extends Repository {
  constructor(knex) {
    super(knex, "dish_pictures");
  }

  getBaseSelectStatement(select = null) {
    return this.knex(this.tableName)
      .select(select)
      .innerJoin("files", "files.id", "dish_pictures.file")
      .options({ nestTables: true });
  }

  static transform(result) {
    if (Array.isArray(result)) {
      return result.map(this.constructor.transform);
    }

    const { dish_pictures, files } = result;

    return { ...dish_pictures, file: files };
  }
}
