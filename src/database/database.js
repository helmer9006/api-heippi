import Sequelize from "sequelize";
import { Constants } from "../constants/constants.js";

export const sequelize = new Sequelize(
  Constants.DB_DATABASE,
  Constants.DB_USERNAME,
  Constants.DB_PASSWORD,
  {
    host: Constants.APP_HOST,
    dialect: Constants.DB_DIALECT,
    logging: false,
  }
);
