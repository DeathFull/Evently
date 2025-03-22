import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  phone: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String },
  role: { type: String, enum: ["ADMIN", "OPERATOR", "USER"] },
});

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;
