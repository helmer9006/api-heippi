import { Constants } from "../constants/constants.js";
import { Specialty } from "../models/specialty.js";
import { validationResult } from "express-validator";

export const createSpecialty = async (req, res) => {
  try {
    console.log("POST - CREATE SPECIALTY");
    // validate errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    const { name } = req.body;
    const { data } = req.user;
    if (data.typeUser !== Constants.TYPE_USER.HOSPITAL) {
      return res.status(403).json({
        status: false,
        response: {},
        msg: "Error at privileges, cannot create specialty",
      });
    }
    //validate reg
    let specialtyReg = await Specialty.findOne({
      where: { name: name.trim() },
    });
    if (specialtyReg) {
      return res.json({
        status: false,
        response: specialtyReg,
        msg: "The specialty already exists",
      });
    }
    const SpecialtyCreated = await Specialty.create({ name });
    if (!SpecialtyCreated) {
      return res.json({
        status: false,
        response: {},
        msg: "could not create the specialty.",
      });
    }
    res.json({
      status: true,
      response: SpecialtyCreated,
      msg: "specialty created successfully.",
    });
  } catch (error) {
    console.log(error);
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error creating specialty" });
  }
};

export const getAllSpecialty = async (req, res) => {
  try {
    console.log("GET -  GET ALL SPECIALTY");
    //validar que  no esté creada previamente
    let specialties = await Specialty.findAll({});
    if (!specialties) {
      return res.status(500).json({
        status: true,
        response: [],
        msg: "specialties not found ",
      });
    }
    res.json({
      status: true,
      response: specialties,
      msg: "Specialties found.",
    });
  } catch (error) {
    console.log(error);
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: [], msg: "Error consulting specialty" });
  }
};

export const deleteSpecialty = async (req, res) => {
  try {
    console.log("POST - DELETE SPECIALTY");
    // validate errors
    const { id } = req.params;
    const { data } = req.user;
    if (data.typeUser !== Constants.TYPE_USER.HOSPITAL) {
      return res.status(500).json({
        status: false,
        response: {},
        msg: "Error at privileges, cannot delete specialty",
      });
    }
    //validate reg
    let specialtyReg = await Specialty.findOne({
      where: { id: Number(id) },
    });

    if (!specialtyReg) {
      return res.json({
        status: false,
        response: specialtyReg,
        msg: "The specialty not exists",
      });
    }
    const SpecialtyDelete = await specialtyReg.destroy();
    console.log(SpecialtyDelete);
    if (!SpecialtyDelete) {
      return res.json({
        status: false,
        response: {},
        msg: "could not delete the specialty.",
      });
    }
    res.json({
      status: true,
      response: SpecialtyDelete,
      msg: "specialty delete successfully.",
    });
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(500).json({
      status: false,
      response: specialtyReg,
      msg: "Error creating specialty",
    });
  }
};
