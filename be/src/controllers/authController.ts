import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateToken } from "../utils/jwtUtils";
import User, { UserDocument } from "../models/User";
import config from "../config";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: UserDocument = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed!" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user: UserDocument | null = await User.findOne({ email });
    // console.log("user ==", user)

    if (!user) {
      res.status(401).json({ message: "Invalid email or password!" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password!" });
      return;
    }

    const payload = { user: { id: user.id } };
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
      // sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // sameSite: "strict",
    });

    res.json({ message: "Login successful!"});
  } catch (err) {
    res.status(500).json({ message: "Login failed!" });
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, refreshToken } = req.cookies as {
    accessToken: string;
    refreshToken: string;
  };

  if (accessToken || refreshToken) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logout successful!" });
  }

  return res.status(401).json({ message: "Invalid session!" });
};
