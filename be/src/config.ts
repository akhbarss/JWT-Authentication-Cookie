import { CookieOptions } from "express";

export default {
  jwtSecret: "secretKey",
  refreshSecret: "secretKeys",
  // jwtExpiration: "5m", 
  jwtExpiration: "5s",
  refreshExpiration: "1w",
  refreshTokenExpiration: "7d",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60,
  } as CookieOptions,
};
