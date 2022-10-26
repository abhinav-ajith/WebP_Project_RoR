const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.PG_USERNAME,
  process.env.PG_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

require("./models")(sequelize);

module.exports = sequelize;
