import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
	type: { type: String, enum: ["CONCERT", "SPECTACLE", "FESTIVAL"] },
	date: { type: Date },
	price: { type: Number },
	location: { type: String },
	name: { type: String },
	maxSellingTickets: { type: Number },
});

const EventModel = mongoose.model("event", EventSchema);
export default EventModel;
