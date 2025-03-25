import express from "express";
import type { Request, Response } from "express";
import { processRequestBody } from "zod-express-middleware";
import { EventSchemaPayload } from "../schemas";
import EventRepository from "../repositories/EventRepository";

const router = express.Router();

router.post("/", processRequestBody(EventSchemaPayload), async (req, res) => {
  try {
    const event = await EventRepository.createEvent({ payload: req.body });
    if (event) {
      res.status(200).json({ message: "Success", status: 200, data: event });
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
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const events = await EventRepository.getEvents();
    if (events) {
      res.status(200).json({ message: "Success", status: 200, data: events });
    } else {
      res.status(404).json({ message: "Not found", status: 404, data: [] });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", status: 500, data: null });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Bad request", status: 400, data: null });
      return;
    }

    const event = await EventRepository.getEventById({ id });
    if (event) {
      res.status(200).json({ message: "Success", status: 200, data: event });
    } else {
      res.status(404).json({ message: "Not found", status: 404, data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", status: 500, data: null });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Bad request", status: 400, data: null });
      return;
    }

    const event = await EventRepository.deleteEvent({ id });
    if (event) {
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

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, date, price, location, name } = req.body;

    if ((!type && !date && !price && !location && !name) || !id) {
      res.status(400).json({ message: "Bad request", status: 400, data: null });
      return;
    }

    const event = await EventRepository.updateEvent({ id, payload: req.body });
    if (event) {
      res.status(200).json({ message: "Success", status: 200, data: event });
    } else {
      res.status(404).json({ message: "Not found", status: 404, data: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", status: 500, data: null });
  }
});

router.get("/filter", async (req: Request, res: Response) => {
  try {
    const { location, type } = req.query;

    const filter: {
      location?: string;
      type?: "CONCERT" | "SPECTACLE" | "FESTIVAL";
    } = {};

    if (typeof location === "string") {
      filter.location = location;
    }

    if (type === "CONCERT" || type === "SPECTACLE" || type === "FESTIVAL") {
      filter.type = type;
    }

    const events = await EventRepository.getEventsByFilter({ filter });

    if (events.length > 0) {
      res.status(200).json({ message: "Success", status: 200, data: events });
    } else {
      res
        .status(404)
        .json({ message: "No events found", status: 404, data: [] });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", status: 500, data: null });
  }
});

export default router;
