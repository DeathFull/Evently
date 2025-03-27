import express from "express";
import type { Request, Response } from "express";
import { processRequestBody } from "zod-express-middleware";
import { TransactionSchemaPayload } from "../schemas";
import TransactionRepository from "../repositories/TransactionRepository";

const router = express.Router();

router.post(
  "/",
  processRequestBody(TransactionSchemaPayload),
  async (req: Request, res: Response) => {
    try {
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
      res
        .status(500)
        .json({ message: "Internal server error", status: 500, data: null });
    }
  },
);

export default router;
