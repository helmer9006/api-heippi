import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../database/database.js";
import { Specialty } from "./specialty.js";
export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    services: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    identification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailVerif: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    typeUser: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recoverPassStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    firstAccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    recoverPass: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    specialtyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    codeActivation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

User.belongsTo(User, {
  foreignKey: {
    name: "createdBy",
    allowNull: true,
  },
  as: "hospital",
});

User.belongsTo(Specialty, {
  foreignKey: {
    name: "specialtyId",
    allowNull: true,
  },
});
