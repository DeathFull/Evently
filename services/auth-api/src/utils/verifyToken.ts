import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const SECRET_KEY = "your_secret_key";

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(403).json({ message: "No token provided", status: 403 });
    return;
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", status: 401 });
  }
}
