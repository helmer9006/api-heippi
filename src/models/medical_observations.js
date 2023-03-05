import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../database/database.js";

export const MedicalObservations = sequelize.define(
  "MedicalObservations",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    observations: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    healthStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reasonForConsultation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
