export default class Repository {
  tableName = null;

  constructor(knex, tableName) {
    this.knex = knex;
    this.tableName = tableName;
  }

  getBaseSelectStatement(select = null) {
    return this.knex(this.tableName).select(select);
  }

  find(select = null) {
    return this.getBaseSelectStatement(select);
  }

  findById(id, select = null) {
    return this.find(select)
      .where(`${this.tableName}.id`, id)
      .then(Repository.toOne);
  }

  add(data) {
    return this.knex(this.tableName).insert(data);
  }

  remove(key, value) {
    return this.knex(this.tableName).where(key, value).delete();
  }

  update(key, value, data) {
    return this.knex(this.tableName).where(key, value).update(data);
  }

  static transform(result) {
    return result;
  }

  static toOne(rows) {
    return rows[0];
  }
}
