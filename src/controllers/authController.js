import { User } from "../models/User.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { getToken } from "../config/jwt.config.js";
import { Op } from "sequelize";
import { Constants } from "../constants/constants.js";

// method of autentication
export const authenticateUser = async (req, res, next) => {
  try {
    // validate errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    // find reg user
    const { identification, password } = req.body;

    let userFound = await User.findOne({
      where: {
        [Op.or]: [{ identification }],
      },
    });
    if (!userFound) {
      return res.status(401).json({
        status: false,
        response: userFound,
        msg: "User not found",
      });
    }

    if (userFound.active == false) {
      return res.status(401).json({
        status: false,
        response: userFound,
        msg: "The user has not confirmed the registration",
      });
    }

    // check password
    const decodedPassword = new Buffer(password, "base64").toString();
    if (!bcrypt.compareSync(decodedPassword, userFound.password)) {
      res.status(401).json({
        status: false,
        response: null,
        msg: "Identification or password incorrect",
      });
      return next();
    }
    // Crear JWT
    const token = getToken({
      id: userFound.id,
      name: userFound.name,
      codeActivation: userFound.codeActivation,
      typeUser: userFound.typeUser,
      identification: userFound.identification,
      active: userFound.active,
      email: userFound.email,
      specialtyId: userFound.specialtyId,
    });
    userFound.dataValues.token = token;
    // return firstAccessDoctor to redirect user to change password in frontend
    // if firstAccessDoctor is false must change password
    if (userFound.typeUser == Constants.TYPE_USER.DOCTOR) {
      userFound.dataValues.firstAccessDoctor = userFound.firstAccess;
    } else {
      if (userFound.firstAccess == false) {
        await userFound.update({ firstAccess: true });
      }
      userFound.dataValues.firstAccessDoctor = true;
    }

    res.json({
      status: true,
      response: userFound,
      msg: "Authenticated successfully.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error at authenticate" });
  }
};
