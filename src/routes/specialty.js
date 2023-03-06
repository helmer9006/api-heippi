import { Router } from "express";
import { check } from "express-validator";
import {
  createSpecialty,
  deleteSpecialty,
  getAllSpecialty,
} from "../controllers/specialty.js";
import { auth } from "./../middleware/auth.js";
const router = Router();

// create specialty
router.post(
  "/create",
  [check("name", "The name of the specialty is required.").not().isEmpty()],
  auth,
  createSpecialty
);
// get specialty
router.get("/all", getAllSpecialty);

// delete specialty
router.delete("/delete/:id", auth, deleteSpecialty);

export default router;
