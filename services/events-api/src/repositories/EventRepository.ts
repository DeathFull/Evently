import EventModel from "../models/EventModel";
import type { Event, EventUpdate } from "../types";

class EventRepository {
  async createEvent({
    payload,
  }: {
    payload: Omit<Event, "id">;
  }): Promise<Event | null> {
    try {
      return (await EventModel.create({ ...payload })) as Event;
    } catch (err) {
      console.error(err);
      throw new Error("Event not created");
    }
  }

  async updateEvent({
    id,
    payload,
  }: {
    id: string;
    payload: EventUpdate;
  }): Promise<Event | null> {
    const update = {} as EventUpdate;
    if (payload.type) update.type = payload.type;
    if (payload.date) update.date = payload.date;
    if (payload.price) update.price = payload.price;
    if (payload.location) update.location = payload.location;
    if (payload.name) update.name = payload.name;

    try {
      return await EventModel.findByIdAndUpdate({ _id: id }, update);
    } catch (error) {
      console.error(error);
      throw new Error("Event not found");
    }
  }

  async deleteEvent({ id }: { id: string }): Promise<Event | null> {
    try {
      return await EventModel.findByIdAndDelete({ _id: id });
    } catch (error) {
      console.error(error);
      throw new Error("Event not found");
    }
  }

  async getEventById({ id }: { id: string }): Promise<Event | null> {
    try {
      return await EventModel.findOne({ _id: id });
    } catch (error) {
      console.error(error);
      throw new Error("Event not found");
    }
  }

  async getEventsByFilter({
    filter,
  }: {
    filter: {
      location?: string;
      type?: "CONCERT" | "SPECTACLE" | "FESTIVAL";
      name?: string;
    };
  }): Promise<Event[]> {
    try {
      const query: {
        location?: string;
        type?: "CONCERT" | "SPECTACLE" | "FESTIVAL";
        name?: string;
      } = {};

      if (filter.location) {
        query.location = filter.location;
      }

      if (filter.type) {
        query.type = filter.type;
      }

      if (filter.name) {
        query.name = filter.name;
      }

      return await EventModel.find(query);
    } catch (err) {
      console.error(err);
      throw new Error("Events not found");
    }
  }

  async getEvents(): Promise<Event[]> {
    try {
      return await EventModel.find();
    } catch (err) {
      console.log(err);
      throw new Error("Events not found");
    }
  }
}

export default new EventRepository();
