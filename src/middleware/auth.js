import { getTokenData } from "../config/jwt.config.js";
import { Constants } from "./../constants/constants.js";

export const auth = (req, res, next) => {
  console.log("POST - AUTENTICATION");
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res
      .status(403)
      .json({ status: false, response: {}, msg: "Unauthorized access." });
  }
  // get token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ status: false, response: {}, msg: "Unauthorized access." });
  }
  // verify token
  try {
    getTokenData;
    const user = getTokenData(token);
    req.user = user;
  } catch (error) {
    return res.status(403).json({
      status: false,
      response: {},
      msg: "Unauthorized access or expired Session.",
    });
  }
  return next();
};
