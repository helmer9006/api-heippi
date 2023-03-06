import { Router } from "express";
import { check } from "express-validator";
import {
  createMedicalObservations,
  getMedicalObservations,
} from "../controllers/medicalObservationsController.js";
import { auth } from "./../middleware/auth.js";
const router = Router();

// create medical observation
router.post(
  "/create",
  [
    check("observations", "The observation is required.").not().isEmpty(),
    check("healthStatus", "The health Status is required.").not().isEmpty(),
    check("reasonForConsultation", "The reason consultation is required.")
      .not()
      .isEmpty(),
  ],
  auth,
  createMedicalObservations
);

// get reg medical observations
router.get("/all", auth, getMedicalObservations);

export default router;
