import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { generateToken } from "../utils/jwtUtils";

const authenticateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  try {
    const decodedAccessToken = jwt.verify(accessToken, config.jwtSecret) as {
      user: { id: string };
      exp: number;
    };

    if (decodedAccessToken.exp * 1000 > Date.now()) {
      // Access token is not expired, continue to the next middleware
      // @ts-ignore
      req.user = { id: decodedAccessToken.user.id };
      next();
    } else if (refreshToken) {
      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          config.refreshSecret
        ) as { user: { id: string } };

        console.log("decodedRefreshToken == ", decodedRefreshToken);

        const newAccessToken = generateToken({
          user: { id: decodedRefreshToken.user.id },
        });

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          maxAge: 5 * 60 * 1000, // 5 minutes
        });

        // @ts-ignore
        req.user = { id: decodedRefreshToken.user.id };
        next();
      } catch (err) {
        console.log("err == ", err);
        return res.status(401).json({ message: "Invalid refresh token" });
      }
    } else {
      return res.status(401).json({ message: "Refresh token not found" });
    }
  } catch (err) {
    // If token verification fails, check if refreshToken exists and generate new accessToken
    if (refreshToken) {
      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          config.refreshSecret
        ) as { user: { id: string } };

        const newAccessToken = generateToken({
          user: { id: decodedRefreshToken.user.id },
        });

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          maxAge: 5 * 60 * 1000, // 5 minutes
        });

        // @ts-ignore
        req.user = { id: decodedRefreshToken.user.id };
        next();
      } catch (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
};

export default authenticateMiddleware;
