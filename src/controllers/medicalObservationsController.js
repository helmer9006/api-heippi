import { MedicalObservations } from "../models/medical_observations.js";
import { validationResult } from "express-validator";
import { Constants } from "../constants/constants.js";
import { User } from "../models/User.js";
import { Specialty } from "../models/specialty.js";

export const createMedicalObservations = async (req, res) => {
  try {
    debugger;
    console.log("POST - MEDICAL OBSERVATIONS");
    //validate error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        status: false,
        response: errores.array(),
        msg: "Error in data input",
      });
    }
    // data user auth
    const { data: userAuth } = req.user;
    if (userAuth.typeUser !== Constants.TYPE_USER.DOCTOR) {
      return res.status(403).json({
        status: false,
        response: {},
        msg: "Error at privileges, cannot create medical observations",
      });
    }

    const doctorId = userAuth.id;
    const specialtyId = userAuth.specialtyId;
    const medicalObservationsSaved = await MedicalObservations.create({
      observations: req.body.observations,
      healthStatus: req.body.healthStatus,
      reasonForConsultation: req.body.reasonForConsultation,
      age: req.body.age || null,
      weight: req.body.weight || null,
      height: req.body.height || null,
      patientId: req.body.patientId,
      specialtyId: specialtyId,
      doctorId: doctorId,
    });

    if (!medicalObservationsSaved) {
      return res.json({
        status: false,
        response: {},
        msg: "could not create medical observation",
      });
    }
    res.json({
      status: true,
      response: medicalObservationsSaved,
      msg: "Medical Observation create successfull.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: [], msg: "Error internal server." });
  }
};

export const getMedicalObservations = async (req, res) => {
  try {
    debugger;
    const { data: userAuth } = req.user;
    let medicalObservationsAll = [];
    switch (userAuth.typeUser) {
      case Constants.TYPE_USER.PATIENT:
        medicalObservationsAll = await MedicalObservations.findAll({
          where: { patientId: userAuth.id },
          include: [
            {
              model: User,
              as: "patient",
            },
            {
              model: User,
              as: "doctor",
              include: [{ model: User, as: "hospital" }],
            },
            {
              model: Specialty,
            },
          ],
        });
        break;
      case Constants.TYPE_USER.DOCTOR:
        medicalObservationsAll = await MedicalObservations.findAll({
          where: { doctorId: userAuth.id },
          include: [
            {
              model: User,
              as: "patient",
            },
            {
              model: User,
              as: "doctor",
              include: [{ model: User, as: "hospital" }],
            },
            {
              model: Specialty,
            },
          ],
        });
        break;
      case Constants.TYPE_USER.HOSPITAL:
        medicalObservationsAll = await MedicalObservations.findAll({
          include: [
            {
              model: User,
              as: "patient",
            },
            {
              model: User,
              as: "doctor",
              where: { createdBy: userAuth.id },
              include: [{ model: User, as: "hospital" }],
            },
            {
              model: Specialty,
            },
          ],
        });
        break;
      default:
        break;
    }
    if (medicalObservationsAll.length == 0) {
      res.status(404).json({
        status: false,
        response: [],
        msg: "Medical observations Not found",
      });
    }
    const result = medicalObservationsAll.map((item) => {
      return {
        id: item.id,
        patient: item.patient.name,
        hospital: item.doctor.hospital.name,
        doctor: item.doctor.name,
        specialty: item.Specialty.name,
        observations: item.observations,
        healthStatus: item.healthStatus,
        reasonForConsultation: item.reasonForConsultation,
        age: item.age,
        weight: item.weight,
        height: item.height,
        birthdate: item.patient.birthdate,
        identification: item.patient.identification,
        phone: item.patient.phone,
        email: item.patient.email,
        birthdate: item.patient.birthdate,
        address: item.patient.address,
        // doctorId: item.doctorId,
        // specialtyId: item.specialtyId,
        // patientId: item.patientId,
        createdAt: item.createdAt,
      };
    });

    res.json({
      status: true,
      response: result,
      msg: "Medical observations found.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      response: {},
      msg: "Error consulting Medical observations",
    });
  }
};
