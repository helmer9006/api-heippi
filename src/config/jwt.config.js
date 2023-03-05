import jwt from "jsonwebtoken";
import { Constants } from "../constants/constants.js";

export const getToken = (payload) => {
  return jwt.sign(
    {
      data: payload,
    },
    Constants.SECRET,
    {
      expiresIn: "8h",
    }
  );
};

export const getTokenData = (token) => {
  let data = null;
  jwt.verify(token, Constants.SECRET, (err, decoded) => {
    if (err) {
      console.log("err data");
    } else {
      data = decoded;
    }
  });
  return data;
};
