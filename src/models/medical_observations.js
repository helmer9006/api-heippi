import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../database/database.js";
import { Specialty } from "./specialty.js";
import { User } from "./User.js";

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
      type: DataTypes.STRING,
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
      allowNull: false,
    },
    specialtyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

MedicalObservations.belongsTo(User, {
  foreignKey: {
    name: "doctorId",
    allowNull: true,
  },
  as: "doctor",
});

MedicalObservations.belongsTo(User, {
  foreignKey: {
    name: "patientId",
    allowNull: true,
  },
  as: "patient",
});

MedicalObservations.belongsTo(Specialty, {
  foreignKey: {
    name: "specialtyId",
    allowNull: true,
  },
});
