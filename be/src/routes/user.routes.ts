import express from "express";
import { getUsers } from "../controllers/userController";
import authenticateMiddleware from "../middleware/authenticateMiddleware";

const router = express.Router();

router.get("/users", authenticateMiddleware, getUsers);

export default router;
