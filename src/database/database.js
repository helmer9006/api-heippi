import Sequelize from "sequelize";

export const sequelize = new Sequelize("api-heippi", "postgres", "abcd1234", {
  host: "localhost",
  dialect: "postgres",
});
