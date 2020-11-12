import nanoid from "../helpers/nanoid";
import Repository from "./repository";

export default class MenuRepository extends Repository {
  constructor(knex) {
    super(knex, "menus");
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
}
