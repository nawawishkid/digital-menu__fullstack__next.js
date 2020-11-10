import nanoid from "../helpers/nanoid";
import Repository from "./repository";

export default class DishRepository extends Repository {
  constructor(knex) {
    super(knex, "dishes");
  }

  findByName(menuName) {
    return this.getBaseSelectStatement()
      .where("name", menuName)
      .then(this.constructor.toOne)
      .then(this.constructor.transform);
  }

  findByMenuId(menuId) {
    return this.getBaseSelectStatement()
      .where("menu", menuId)
      .then(this.constructor.toOne)
      .then(this.transform);
  }

  add(data) {
    const isArray = Array.isArray(data);
    let dataWithId;

    if (isArray) {
      dataWithId = data.map(this._assignId);
    } else {
      dataWithId = this._assignId(data);
    }

    console.log(`dataWithId: `, dataWithId);

    return super
      .add(dataWithId)
      .then(() => (isArray ? dataWithId.map(d => d.id) : dataWithId.id));
  }

  _assignId(data) {
    return { ...data, id: nanoid() };
  }

  getBaseSelectStatement(select = null) {
    return this.knex(this.tableName)
      .select(select)
      .innerJoin("menus", "menus.id", "dishes.menu")
      .leftJoin("cuisines", "cuisines.id", "dishes.cuisine")
      .options({ nestTables: true });
  }

  static transform(result) {
    if (Array.isArray(result)) {
      return result.map(this.constructor.transform);
    }

    const { dishes, menus, cuisines } = result;

    return { ...dishes, menu: menus, cuisine: cuisines };
  }
}
