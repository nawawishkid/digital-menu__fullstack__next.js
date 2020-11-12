import set from "lodash/set";
import nanoid from "../helpers/nanoid";
import Repository from "./repository";

export default class DishRepository extends Repository {
  constructor(knex) {
    super(knex, "dishes");
  }

  findByName(menuName) {
    return this.getBaseSelectStatement()
      .where(`${this.tableName}.name`, menuName)
      .then(this.constructor.toOne)
      .then(this.constructor.transform.bind(this));
  }

  findByMenuId(menuId) {
    return this.getBaseSelectStatement()
      .where(`${this.tableName}.menu`, menuId)
      .then(this.constructor.transform.bind(this));
  }

  add(data) {
    const isArray = Array.isArray(data);
    let dataWithId;

    if (isArray) {
      dataWithId = data.map(this._assignId);
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

  getBaseSelectStatement(select = null) {
    return this.knex(this.tableName)
      .select(
        "dishes.id as id",
        "dishes.name as name",
        "dishes.description as description",
        "dishes.price as price",
        "cuisines.name as cuisine",
        "dishes.menu as menuId",
        "files.path as picture"
      )
      .innerJoin("menus", "menus.id", "dishes.menu")
      .leftJoin("cuisines", "cuisines.id", "dishes.cuisine")
      .leftJoin("dish_pictures", "dish_pictures.dish", "dishes.id")
      .leftJoin("files", "files.id", "dish_pictures.file")
      .options({ nestTables: true });
  }

  static transform(result) {
    if (!result) return result;

    if (Array.isArray(result)) {
      return Object.values(
        result.map(this.constructor.transform).reduce((obj, row) => {
          if (!(row.id in obj)) {
            set(obj, row.id, row);
          } else {
            if (row.pictures.length) {
              obj[row.id].pictures.push(row.pictures[0]);
            }
          }

          return obj;
        }, {})
      );
    }

    return {
      ...result.dishes,
      cuisine: result.cuisines.cuisine,
      pictures: result.files.picture ? [result.files.picture] : [],
    };
  }
}
