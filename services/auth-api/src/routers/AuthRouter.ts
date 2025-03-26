import express from "express";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { processRequestBody } from "zod-express-middleware";
import AuthRepository from "../repositories/AuthRepository";
import { AuthSchemaPayload, RegisterSchemaPayload } from "../schema";
import verifyToken from "../utils/verifyToken";
import { receive, send } from "../utils/send";
import { channel, requestQueue, responseQueue, responseMap } from "../index";

const SECRET_KEY = "your_secret_key";
const router = express.Router();

// connectRabbitMQ();

router.post(
  "/login",
  processRequestBody(AuthSchemaPayload),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      // Generate a unique correlation ID for this request
      const correlationId = Math.random().toString() + Date.now().toString();
      
      // Create a promise that will be resolved when we get a response
      const userDataPromise = new Promise((resolve) => {
        responseMap.set(correlationId, resolve);
      });
      
      // Send request to users-api via RabbitMQ
      channel.sendToQueue(
        requestQueue,
        Buffer.from(JSON.stringify({ email })),
        {
          correlationId,
          replyTo: responseQueue,
        }
      );
      
      // Wait for the response
      const userData = await userDataPromise as any;
      
      if (!userData) {
        return res.status(401).json({ message: "Invalid credentials", status: 401 });
      }

      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials", status: 401 });
      }

      const token = jwt.sign(
        { userId: userData.id, email: userData.email },
        SECRET_KEY,
        { expiresIn: "1h" },
      );

      res.status(200).json({ message: "Login successful", status: 200, token });
    } catch (error) {
      console.error("Login error:", error);
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
