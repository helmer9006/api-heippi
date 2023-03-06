import { MedicalObservations } from "../models/medical_observations.js";
import { validationResult } from "express-validator";
import { Constants } from "../constants/constants.js";
import { User } from "../models/User.js";
import { Specialty } from "../models/specialty.js";
import xl from "excel4node";
import path, { dirname } from "path";

export const createMedicalObservations = async (req, res) => {
  try {
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

export const reportPatients = async (req, res) => {
  try {
    const { patientId } = req.params;
    const medicalObservationsAll = await MedicalObservations.findAll({
      where: { patientId: patientId },
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
    if (medicalObservationsAll.length == 0) {
      return res.status(404).json({
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
        address: item.patient.address,
        createdAt: item.createdAt,
      };
    });

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();
    const dateNow = new Date();
    const filename = `reportePatient_${dateNow.toISOString().slice(0, 10)}`;
    var ws = wb.addWorksheet(dateNow);
    // Create a reusable style
    var styleInitialColumn = wb.createStyle({
      font: {
        name: "Arial",
        color: "#000000",
        size: 12,
        bold: true,
      },
    });
    var styleContent = wb.createStyle({
      font: {
        name: "Arial",
        color: "#545454",
        size: 11,
      },
    });

    ws.cell(1, 1).string("Id").style(styleInitialColumn);
    ws.cell(1, 2).string("Paciente").style(styleInitialColumn);
    ws.cell(1, 3).string("Hospital").style(styleInitialColumn);
    ws.cell(1, 4).string("Medico").style(styleInitialColumn);
    ws.cell(1, 5).string("especialidad").style(styleInitialColumn);
    ws.cell(1, 6).string("observaciones_medicas").style(styleInitialColumn);
    ws.cell(1, 7).string("estado_de_salud").style(styleInitialColumn);
    ws.cell(1, 8).string("motivo_consulta").style(styleInitialColumn);
    ws.cell(1, 9).string("edad").style(styleInitialColumn);
    ws.cell(1, 10).string("peso").style(styleInitialColumn);
    ws.cell(1, 11).string("altura").style(styleInitialColumn);
    ws.cell(1, 12).string("fecha_nacimiento").style(styleInitialColumn);
    ws.cell(1, 13).string("identificacion").style(styleInitialColumn);
    ws.cell(1, 14).string("correo").style(styleInitialColumn);
    ws.cell(1, 15).string("telefono").style(styleInitialColumn);
    ws.cell(1, 16).string("direccion").style(styleInitialColumn);
    ws.cell(1, 17).string("fecha_registro").style(styleInitialColumn);

    // create rows data
    let firstRow = 2;
    console.log("result", result[0]);
    console.log("result", result[1]);

    for (let item of result) {
      ws.cell(firstRow, 1).number(item.id).style(styleContent);
      ws.cell(firstRow, 2).string(item.patient).style(styleContent);
      ws.cell(firstRow, 3).string(item.hospital).style(styleContent);
      ws.cell(firstRow, 4).string(item.doctor).style(styleContent);
      ws.cell(firstRow, 5).string(item.specialty).style(styleContent);
      ws.cell(firstRow, 6).string(item.observations).style(styleContent);
      ws.cell(firstRow, 7).string(item.healthStatus).style(styleContent);
      ws.cell(firstRow, 8)
        .string(item.reasonForConsultation)
        .style(styleContent);
      ws.cell(firstRow, 9).string(item.age).style(styleContent);
      ws.cell(firstRow, 10).string(item.weight).style(styleContent);
      ws.cell(firstRow, 11).string(item.height).style(styleContent);
      ws.cell(firstRow, 12).date(item.birthdate).style(styleContent);
      ws.cell(firstRow, 13).string(item.identification).style(styleContent);
      ws.cell(firstRow, 14).string(item.phone).style(styleContent);
      ws.cell(firstRow, 15).string(item.email).style(styleContent);
      ws.cell(firstRow, 16).string(item.address).style(styleContent);
      ws.cell(firstRow, 17).date(item.createdAt).style(styleContent);
      firstRow = firstRow + 1;
    }

    const pathFile = path.join(`./public/xlsx/${filename}.xlsx`);
    console.log("pathFile", pathFile);
    // reg data at file
    wb.write(pathFile, function (err, stats) {
      if (err) console.log(err);
      else {
        // TODO: save in aws bucket of s3 or other service de storage
        // TODO: delete file path local
        // TODO: return url remote of file
        // for this test I simulate the url to download the file
        return res.json({
          status: true,
          response: `http://localhost:4000/public/xlsx/${filename}.xlsx`,
          msg: "Medical observations found.",
        });
      }
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
