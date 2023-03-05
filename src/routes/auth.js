import { Router } from "express";
import { check } from "express-validator";
import { Constants } from "../constants/constants.js";
import { authenticateUser } from "../controllers/authController.js";
const router = Router();
router.post(
  "/",
  [
    check("identification", "The identification is required.").not().isEmpty(),
    check(
      "password",
      "the password cannot be empty and must contain at least 6 characters."
    )
      .not()
      .isEmpty(),
  ],
  authenticateUser
);
export default router;