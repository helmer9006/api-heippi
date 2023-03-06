import { Router } from "express";
import { check } from "express-validator";
import { Constants } from "../constants/constants.js";
import {
  getAllUsers,
  createUserTypeHospitalOrPatient,
  activate,
  changePassword,
  createTypeDoctor,
} from "../controllers/UserController.js";
import { auth } from "./../middleware/auth.js";

const router = Router();

// create new user tipo hospital or patient
router.post(
  "/createTypeHospitalOrPatient",
  [
    check("name", "The name is required").not().isEmpty(),
    check("identification", "The identification is required").not().isEmpty(),
    check("phone", "The phone is required").not().isEmpty(),
    check("email", "Add an email valid.").isEmail(),
    check(
      "password",
      "the password cannot be empty and must contain at least 6 characters."
    ).isLength({ min: 6 }),
    check("typeUser", "The type user is required")
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (
          ![Constants.TYPE_USER.PATIENT, Constants.TYPE_USER.HOSPITAL].includes(
            value
          )
        ) {
          throw new Error("Error the type user  not is valid");
        }
        return true;
      }),
  ],
  createUserTypeHospitalOrPatient
);

// create new user tipo doctor
router.post(
  "/createTypeDoctor",
  [
    check("name", "The name is required").not().isEmpty(),
    check("identification", "The identification is required").not().isEmpty(),
    check("phone", "The phone is required").not().isEmpty(),
    check("email", "Add an email valid.").isEmail(),
    check(
      "password",
      "the password cannot be empty and must contain at least 6 characters."
    ).isLength({ min: 6 }),
    check("typeUser", "The type user is required")
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (![Constants.TYPE_USER.DOCTOR].includes(value)) {
          throw new Error("Error the type user not is valid");
        }
        return true;
      }),
    check(
      "specialtyId",
      "The specialtyId is numeric and is required"
    ).isNumeric(),
  ],
  auth,
  createTypeDoctor
);

// get all users
router.get("/getAllUsers", getAllUsers);

// activate register user
router.get("/activate/:token", activate);

// change password user
router.put(
  "/changePassword/",
  [
    check(
      "password",
      "The password cannot be empty and must contain at least 6 characters.."
    ).isLength({ min: 6 }),
    check(
      "newPassword",
      "The new password cannot be empty and must contain at least 6 characters."
    ).isLength({ min: 6 }),
  ],
  auth,
  changePassword
);

export default router;
