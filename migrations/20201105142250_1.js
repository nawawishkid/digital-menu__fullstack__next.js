exports.up = function (knex) {
  return knex.schema
    .createTable("users", table => {
      table.increments("id");
      table.string("email", 255).unique();
      table.string("firstName", 255);
      table.string("lastName", 255);
      table.timestamp("createdAt").defaultTo(knex.fn.now());
    })
    .createTable("otps", table => {
      table.increments("id");
      table.integer("user").unsigned().notNullable();
      table.string("password").notNullable();
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("expiresAt").notNullable();

      table.foreign("user").references("id").inTable("users");
    })
    .createTable("capabilities", table => {
      table.increments("id");
      table.string("name", 255).notNullable().unique();
      table.text("description");
    })
    .createTable("roles", table => {
      table.increments("id");
      table.string("name", 255).notNullable().unique();
      table.text("description");
    })
    .createTable("role_capabilities", table => {
      table.integer("role").notNullable().unsigned();
      table.integer("capability").notNullable().unsigned();

      table.foreign("role").references("id").inTable("roles");
      table.foreign("capability").references("id").inTable("capabilities");

      table.primary(["role", "capability"]);
    })
    .createTable("restaurants", table => {
      table.uuid("id").notNullable().primary();
      table.string("name", 255).notNullable().index();
      table.text("bio");
      table.text("profilePicture").notNullable();
      table.integer("owner").unsigned().notNullable();
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());

      table.foreign("owner").references("id").inTable("users");
    })
    .createTable("menus", table => {
      table.increments("id");
      table.string("name", 255).notNullable().index();
      table.text("description");
      table.uuid("ownedBy").notNullable();
      table.integer("createdBy").unsigned().notNullable();
      table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());

      table.foreign("ownedBy").references("id").inTable("restaurants");
      table.foreign("createdBy").references("id").inTable("users");
    })
    .createTable("cuisines", table => {
      table.increments("id");
      table.string("name", 255).notNullable().index();
      table.text("description");
    })
    .createTable("dishes", table => {
      table.increments("id");
      table.string("name", 255).notNullable().index();
      table.text("description");
      table.float("price").notNullable();
      table.integer("cuisine").unsigned().notNullable();
      table.integer("menu").unsigned().notNullable();

      table.foreign("cuisine").references("id").inTable("cuisines");
      table.foreign("menu").references("id").inTable("menus");

      table.unique(["name", "menu"]);
    })
    .createTable("ingredients", table => {
      table.increments("id");
      table.string("name", 255).notNullable().index();
      table.text("description");
    })
    .createTable("dish_ingredients", table => {
      table.integer("dish").unsigned().notNullable();
      table.integer("ingredient").unsigned().notNullable();

      table.foreign("dish").references("id").inTable("dishes");
      table.foreign("ingredient").references("id").inTable("ingredients");

      table.primary(["dish", "ingredient"]);
    })
    .createTable("files", table => {
      table.increments("id");
      table.string("name", 255).notNullable().index();
      table.text("description");
      table.text("filePath").notNullable();
      table.string("fileType").notNullable();
    })
    .createTable("dish_pictures", table => {
      table.integer("dish").unsigned().notNullable();
      table.integer("file").unsigned().notNullable();

      table.foreign("dish").references("id").inTable("dishes");
      table.foreign("file").references("id").inTable("files");

      table.primary(["dish", "file"]);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("dish_pictures")
    .dropTable("dishe_ingredients")
    .dropTable("role_capabilities")
    .dropTable("otps")
    .dropTable("dishes")
    .dropTable("menus")
    .dropTable("restaurants")
    .dropTable("files")
    .dropTable("cuisines")
    .dropTable("roles")
    .dropTable("capabilities")
    .dropTable("users")
    .dropTable("ingredients");
};
