import express from "express";
import type { Request, Response } from "express";
import { processRequestBody } from "zod-express-middleware";
import UserRepository from "../repositories/UserRepository.js";
import { UserSchemaPayload } from "../schemas";
import { normalizeUser } from "../utils/normalize";

const router = express.Router();

router.post(
  "/",
  processRequestBody(UserSchemaPayload),
  async (req: Request, res: Response) => {
    try {
      const user = await UserRepository.createUser({ payload: req.body });
      if (user) {
        const data = normalizeUser({ user });
        res.status(200).json({ message: "Success", status: 200, data: data });
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

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UserRepository.getUsers();
    if (users) {
      const data = users.map((user) => normalizeUser({ user }));
      res.status(200).json({ message: "Success", status: 200, data: data });
    } else {
      res.status(404).json({ message: "Not found", status: 404, data: [] });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", status: 500, data: null });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Bad request", status: 400, data: null });
      return;
    }

    const user = await UserRepository.getUserById({ id });
    if (user) {
      const data = normalizeUser({ user });
      res.status(200).json({ message: "Success", status: 200, data: data });
    } else {
      res.status(404).json({ message: "Not found", status: 404, data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", status: 500, data: null });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Bad request", status: 400, data: null });
      return;
    }

    const user = await UserRepository.deleteUser({ id });
    if (user) {
      res.status(204).json({ message: "No content", status: 204 });
    } else {
      res.status(404).json({ message: "Not found", status: 404, data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", status: 500, data: null });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { emailAddress, firstName, lastName, password, rib, avatar } =
      req.body;

    if (
      (!emailAddress &&
        !firstName &&
        !lastName &&
        !password &&
        !rib &&
        !avatar) ||
      !id
    ) {
      res.status(400).json({ message: "Bad request", status: 400, data: null });
      return;
    }

    const user = await UserRepository.updateUser({ id, payload: req.body });
    if (user) {
      const data = normalizeUser({ user });
      res.status(200).json({ message: "Success", status: 200, data: data });
    } else {
      res.status(404).json({ message: "Not found", status: 404, data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", status: 500, data: null });
  }
});

export default router;
