import express from "express";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { processRequestBody } from "zod-express-middleware";
import AuthRepository from "../repositories/AuthRepository";
import { AuthSchemaPayload, RegisterSchemaPayload } from "../schema";
import connectRabbitMQ from "../utils/connectRabbitMQ";
import verifyToken from "../utils/verifyToken";
import { receive, send } from "../utils/send";

const SECRET_KEY = "your_secret_key";
const router = express.Router();

// connectRabbitMQ();

router.post(
  "/login",
  processRequestBody(AuthSchemaPayload),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await AuthRepository.getUserByEmail({ email });
      if (!user) {
        res.status(401).json({ message: "Invalid credentials", status: 401 });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials", status: 401 });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" },
      );

      res.status(200).json({ message: "Login successful", status: 200, token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", status: 500 });
    }
  },
);

router.get("/test", async (req: Request, res: Response) => {
  console.log("Sending test message...");
  send("user.created", "test-coucoucpqhsdfkjqlsd");
  res.status(200).json({ message: "Test message sent", status: 200 });
});

router.get("/coucou", async (req: Request, res: Response) => {
  receive("user.created");
  console.log("_____coucou");
  res.status(200).json({ message: "coucou", status: 200 });
});

export default router;
