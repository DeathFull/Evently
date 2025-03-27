import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "supersecretkey";

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
		// @ts-ignore
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid token", status: 401 });
	}
}
