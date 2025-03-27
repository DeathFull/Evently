import express from "express";
import type { Request, Response } from "express";
import { processRequestBody } from "zod-express-middleware";
import { TransactionSchemaPayload } from "../schemas";
import TransactionRepository from "../repositories/TransactionRepository";
import { 
  channel, 
  userRequestQueue, 
  userResponseQueue, 
  eventRequestQueue, 
  eventResponseQueue, 
  responseMap 
} from "../index";

const router = express.Router();

// Helper function to check if a user exists
async function checkUserExists(userId: string): Promise<boolean> {
  const correlationId = `user_${Math.random().toString()}_${Date.now().toString()}`;
  
  const userDataPromise = new Promise((resolve) => {
    responseMap.set(correlationId, resolve);
  });
  
  channel.sendToQueue(
    userRequestQueue,
    Buffer.from(JSON.stringify({ id: userId })),
    {
      correlationId,
      replyTo: userResponseQueue,
    }
  );
  
  const userData = await userDataPromise as any;
  return !!userData; // Convert to boolean
}

// Helper function to check if an event exists
async function checkEventExists(eventId: string): Promise<boolean> {
  const correlationId = `event_${Math.random().toString()}_${Date.now().toString()}`;
  
  const eventDataPromise = new Promise((resolve) => {
    responseMap.set(correlationId, resolve);
  });
  
  channel.sendToQueue(
    eventRequestQueue,
    Buffer.from(JSON.stringify({ id: eventId })),
    {
      correlationId,
      replyTo: eventResponseQueue,
    }
  );
  
  const eventData = await eventDataPromise as any;
  return !!eventData; // Convert to boolean
}

router.post(
  "/",
  processRequestBody(TransactionSchemaPayload),
  async (req: Request, res: Response) => {
    try {
      const { userId, eventId } = req.body;
      
      // Check if user exists
      const userExists = await checkUserExists(userId);
      if (!userExists) {
        return res.status(404).json({ 
          message: "User not found", 
          status: 404, 
          data: null 
        });
      }
      
      // Check if event exists
      const eventExists = await checkEventExists(eventId);
      if (!eventExists) {
        return res.status(404).json({ 
          message: "Event not found", 
          status: 404, 
          data: null 
        });
      }
      
      // If both user and event exist, create the transaction
      const transaction = await TransactionRepository.createTransaction({
        payload: req.body,
      });
      
      if (transaction) {
        res
          .status(200)
          .json({ message: "Success", status: 200, data: transaction });
      } else {
        res
          .status(500)
          .json({ message: "Internal server error", status: 500, data: null });
      }
    } catch (error) {
      console.error("Transaction creation error:", error);
      res
        .status(500)
        .json({ message: "Internal server error", status: 500, data: null });
    }
  },
);

export default router;
