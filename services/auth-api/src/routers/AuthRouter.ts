import express from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { processRequestBody } from "zod-express-middleware";
import { AuthSchemaPayload } from "../schema";
import { channel, requestQueue, responseQueue, responseMap } from "../index";

const SECRET_KEY = "supersecretkey";
const router = express.Router();

router.post(
  "/login",
  processRequestBody(AuthSchemaPayload),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const correlationId = Math.random().toString() + Date.now().toString();

      const userDataPromise = new Promise((resolve) => {
        responseMap.set(correlationId, resolve);
      });

      channel.sendToQueue(
        requestQueue,
        Buffer.from(JSON.stringify({ email })),
        {
          correlationId,
          replyTo: responseQueue,
        },
      );

      const userData = (await userDataPromise) as {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
      };

      if (!userData) {
        return res
          .status(401)
          .json({ message: "Invalid credentials", status: 401 });
      }

      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Invalid credentials", status: 401 });
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

export default router;
