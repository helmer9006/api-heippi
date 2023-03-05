import dotenv from 'dotenv'
dotenv.config()
export const Constants = {
  TYPE_USER: {
    HOSPITAL: "hospital",
    PATIENT: "patient",
    DOCTOR: "doctor",
  },
  APP_PORT: process.env.APP_PORT || 4000,
  APP_HOST: process.env.APP_HOST || "localhost",
  SECRET: process.env.SECRET,
  URL_SERVER: `${process.env.APP_HOST}:${process.env.APP_PORT}`,
};
