import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import type { User, UserUpdate } from "../types.js";

class UserRepository {
  async createUser({
    payload,
  }: {
    payload: Omit<User, "id" | "role">;
  }): Promise<User | null> {
    if (!payload.password) {
      throw new Error("Password is required");
    }
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(payload.password, salt);
      return (await UserModel.create({
        email: payload.email,
        phone: payload.phone,
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: hash,
        role: "USER",
      })) as User;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async updateUser({
    id,
    payload,
  }: {
    id: string;
    payload: UserUpdate;
  }): Promise<User | null> {
    const update = {} as UserUpdate;
    if (payload.email) update.email = payload.email;
    if (payload.firstName) update.firstName = payload.firstName;
    if (payload.lastName) update.lastName = payload.lastName;
    if (payload.role) update.role = payload.role;
    if (payload.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(payload.password, salt);
      update.password = hash;
    }

    try {
      return await UserModel.findByIdAndUpdate({ _id: id }, update);
    } catch (error) {
      console.error(error);
      throw new Error("User not found");
    }
  }

  async deleteUser({ id }: { id: string }): Promise<User | null> {
    try {
      return await UserModel.findByIdAndDelete({ _id: id });
    } catch (error) {
      console.error(error);
      throw new Error("User not found");
    }
  }

  async getUserById({ id }: { id: string }): Promise<User | null> {
    try {
      return await UserModel.findOne({ _id: id });
    } catch (error) {
      console.error(error);
      throw new Error("User not found");
    }
  }

  async getUserByEmail({ email }: { email: string }): Promise<User | null> {
    try {
      return await UserModel.findOne({
        email,
      });
    } catch (err) {
      console.log(err);
      throw new Error("User not found");
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      return await UserModel.find();
    } catch (err) {
      console.log(err);
      throw new Error("Users not found");
    }
  }
}

export default new UserRepository();
