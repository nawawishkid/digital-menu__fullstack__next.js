import nanoid from "../helpers/nanoid";
import Repository from "./repository";

export default class RestaurantRepository extends Repository {
  constructor(knex) {
    super(knex, "restaurants");
  }

  findById(restaurantId, select = null) {
    return super
      .findById(restaurantId, select)
      .then(this.constructor.transform);
  }

  findRestaurantByOwnerId(ownerId) {
    return this.find()
      .where(`${this.tableName}.owner`, ownerId)
      .then(this.constructor.transform);
  }

  add(data) {
    const isArray = Array.isArray(data);
    let dataWithId;

    if (isArray) {
      dataWithId = data.map(d => this._assignId(d));
    } else {
      dataWithId = this._assignId(data);
    }

    return super
      .add(dataWithId)
      .then(() => (isArray ? dataWithId.map(d => d.id) : dataWithId.id));
  }

  _assignId(data) {
    return { ...data, id: nanoid() };
  }

  getBaseSelectStatement() {
    return this.knex(this.tableName)
      .select()
      .innerJoin("users", `${this.tableName}.owner`, "users.id")
      .innerJoin("files", `${this.tableName}.profilePicture`, "files.id")
      .options({ nestTables: true });
  }

  static transform(result) {
    if (!result) return result;

    if (Array.isArray(result)) {
      return result.map(RestaurantRepository.transform);
    }

    const { restaurants, users, files } = result;

    delete users.createdAt;

    return { ...restaurants, profilePicture: files, owner: users };
  }
}
