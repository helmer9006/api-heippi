import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import path from "path";
import { Constants } from "../constants/constants.js";
import fs from "fs";
import { getToken, getTokenData } from "../config/jwt.config.js";
import { sendMail } from "../config/mail.config.js";

// create user type hospital and patient
export const createUserTypeHospitalOrPatient = async (req, res) => {
  console.log("POST - CREATE USER TYPE HOSPITAL OR PATIENT");
  try {
    //validate error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        status: false,
        response: errores.array(),
        msg: "Error in data input",
      });
    }
    const {
      name,
      password,
      address,
      services,
      birthdate,
      identification,
      phone,
      email,
      typeUser,
    } = req.body;
    // check if user is already registered
    let userReg = await User.findOne({
      where: {
        [Op.or]: [{ identification }],
      },
    });
    if (userReg) {
      return res.json({
        status: false,
        response: userReg,
        msg: "User already exists",
      });
    }
    // check data basic hospital
    if (
      typeUser == Constants.TYPE_USER.HOSPITAL &&
      (!name || !address || !services)
    ) {
      return res.json({
        status: false,
        response: null,
        msg: "Does not meet basic data for the type of user (required name, address and services)",
      });
    }
    // check data basic patient
    if (
      typeUser == Constants.TYPE_USER.PATIENT &&
      (!name || !address || !birthdate)
    ) {
      return res.json({
        status: false,
        response: null,
        msg: "Does not meet basic data for the type of user(required name, address and birthdate)",
      });
    }

    // Hashear pass
    const decodedPassword = new Buffer(password, "base64").toString();
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(decodedPassword, salt);

    const userCreated = await User.create({
      name: req.body.name,
      password: req.body.password,
      address: req.body.address || "",
      services: req.body.services || "",
      birthdate: req.body.birthdate || null,
      identification: req.body.identification,
      phone: req.body.phone,
      email: req.body.email,
      typeUser: req.body.typeUser,
      codeActivation: Math.floor(Math.random() * 1000000 + 1),
    });
    if (!userCreated) {
      return res.json({
        status: false,
        response: {},
        msg: "could not create user",
      });
    }
    // create token
    const token = getToken({
      id: userCreated.id,
      name: userCreated.name,
      codeActivation: userCreated.codeActivation,
      typeUser: userCreated.typeUser,
      identification: userCreated.identification,
      active: userCreated.active,
      email: userCreated.email,
    });
    // enviar email con código
    fs.readFile(
      "./src/templates/register-user.html",
      async function (err, data) {
        if (err) throw err;
        const asunto = "Confirmación de nuevo usuario";
        let body = data.toString();
        const url = `http://${Constants.URL_SERVER}/api/users/activate/${token}`;
        body = body.replace("<URL_REDIRECCION>", url);
        body = body.replace("@NAME", userCreated.name);
        const rest = await sendMail(userCreated.email, asunto, body);
      }
    );

    res.json({
      status: true,
      response: userCreated,
      msg: "User create successfull.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error creating user" });
  }
};

// create user type doctor
export const createTypeDoctor = async (req, res) => {
  console.log("POST - CREATE USER TYPE DOCTOR");
  try {
    //validate error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        status: false,
        response: errores.array(),
        msg: "Error in data input",
      });
    }
    // data is user authenticated
    const { data } = req.user.data.createdBy;

    const {
      name,
      password,
      address,
      services,
      birthdate,
      identification,
      phone,
      email,
      typeUser,
      specialtyId,
    } = req.body;
    if (data.typeUser != Constants.TYPE_USER.HOSPITAL) {
      return res.json({
        status: false,
        response: userReg,
        msg: "Unauthorized access, cannot create doctor.",
      });
    }
    // check if user is already registered
    let userReg = await User.findOne({
      where: {
        [Op.or]: [{ identification }],
      },
    });
    if (userReg) {
      return res.json({
        status: false,
        response: userReg,
        msg: "User already exists",
      });
    }

    // Hashear pass
    const decodedPassword = new Buffer(password, "base64").toString();
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(decodedPassword, salt);

    const userCreated = await User.create({
      name: req.body.name,
      password: req.body.password,
      address: req.body.address || "",
      services: req.body.services || "",
      birthdate: req.body.birthdate || null,
      identification: req.body.identification,
      phone: req.body.phone,
      email: req.body.email,
      typeUser: req.body.typeUser,
      codeActivation: Math.floor(Math.random() * 1000000 + 1),
      specialtyId: req.body.specialtyId,
      createdBy: createdBy,
    });
    if (!userCreated) {
      return res.json({
        status: false,
        response: {},
        msg: "could not create user",
      });
    }
    //create token
    const token = getToken({
      id: userCreated.id,
      name: userCreated.name,
      codeActivation: userCreated.codeActivation,
      typeUser: userCreated.typeUser,
      identification: userCreated.identification,
      active: userCreated.active,
      email: userCreated.email,
    });
    // enviar email con código
    fs.readFile(
      "./src/templates/register-user.html",
      async function (err, data) {
        if (err) throw err;
        const asunto = "Confirmación de nuevo usuario";
        let body = data.toString();
        const url = `http://${Constants.URL_SERVER}/api/users/activate/${token}`;
        body = body.replace("<URL_REDIRECCION>", url);
        body = body.replace("@NAME", userCreated.name);
        const rest = await sendMail(userCreated.email, asunto, body);
      }
    );

    res.json({
      status: true,
      response: userCreated,
      msg: "User create successfull.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error creating user" });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  console.log("GET - ALL USERS");
  try {
    const users = await User.findAll();
    if (users.length == 0) {
      return res.json({ status: true, response: [], msg: "Users not found" });
    }
    res.json({ status: true, response: users, msg: "Users found" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: [], msg: "Error internal server." });
  }
};

// activate user
export const activate = async (req, res) => {
  try {
    console.log("GET - ACTIVATE USER");
    const { token } = req.params;
    const dataUser = await getTokenData(token);
    if (!dataUser) {
      return res.json({
        status: false,
        response: null,
        msg: "Err of data user",
      });
    }
    const user = await User.findOne({
      where: { identification: dataUser.data.identification },
      attributes: ["id", "codeActivation"],
    });
    if (!user) {
      return res.json({
        status: false,
        response: null,
        msg: "Err user not found",
      });
    }
    const { codeActivation } = dataUser.data;
    if (codeActivation !== user.codeActivation) {
      return res.redirect("/public/error.html");
    }

    const update = await user.update({ active: true });
    if (!update) {
      return res.json({
        status: false,
        response: null,
        msg: "error confirming user",
      });
    }
    return res.redirect("/public/activate.html");
  } catch (error) {
    console.log("Err activating account", error);
  }
};

// change password user
export const changePassword = async (req, res) => {
  try {
    console.log("PUT - CHANGE PASSWORD");
    //validate error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        status: false,
        response: errores.array(),
        msg: "Error in data input",
      });
    }
    const { password, newPassword } = req.body;
    const {
      data: { id },
    } = req.user;
    const userFound = await User.findOne({
      where: { id },
      attributes: ["id", "password"],
    });
    if (!userFound) {
      return res.status(401).json({
        status: false,
        response: {},
        msg: "user not found.",
      });
    }
    const decodedPassword = new Buffer(password, "base64").toString();
    const decodedNewPassword = new Buffer(newPassword, "base64").toString();
    if (!bcrypt.compareSync(decodedPassword, userFound.password)) {
      return res.status(401).json({
        status: false,
        response: {},
        msg: "The password sent is wrong",
      });
    }
    // Hashear password
    const salt = await bcrypt.genSalt(10);
    let passNew = await bcrypt.hash(decodedNewPassword, salt);
    const updatedPass = await userFound.update({ password: passNew });
    if (!updatedPass) {
      return res.status(401).json({
        status: false,
        response: {},
        msg: "user not updated.",
      });
    }
    if (
      userFound.typeUser == Constants.TYPE_USER.DOCTOR &&
      updatedPass.firstAccess == false
    ) {
      await userFound.update({ firstAccess: true });
    }
    res.status(200).json({
      status: true,
      response: updatedPass,
      msg: "User updated.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: [], msg: "Error internal server." });
  }
};
