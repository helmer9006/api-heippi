import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../database/database.js";

export const Doctor = sequelize.define(
  "Doctor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    specialtyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
