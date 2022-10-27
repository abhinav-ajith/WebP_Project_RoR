const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.PG_USERNAME, process.env.PG_PASSWORD, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

require("./models")(sequelize);

sequelize.models.SysAdmin.create({
  admin_username: "admin",
  admin_password: require("crypto").createHash("sha256").update("admin").digest("hex"),
}).catch((err) => console.log("admin created"));

module.exports = sequelize;
