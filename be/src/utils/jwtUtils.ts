import jwt from "jsonwebtoken";
import config from "../config";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, config.refreshSecret, {
    expiresIn: config.refreshExpiration,
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwtSecret);
};
