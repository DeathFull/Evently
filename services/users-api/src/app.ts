import cors from "cors";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import swaggerUi from "swagger-ui-express";
import UserRouter from "./routers/UserRouter";
import { loadSwaggerDocument } from "./utils/swagger";

export const app = express();

app.use(express.json());

const allowedOrigins = ["http://localhost:3000", "*"];

app.use(
	cors({
		origin: (
			origin: string | undefined,
			callback: (err: Error | null, allow?: boolean) => void,
		) => {
			if (!origin || allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
		allowedHeaders: ["Authorization", "Content-Type"],
	}),
);

let swaggerDocument = null;
loadSwaggerDocument()
	.then((document) => {
		swaggerDocument = document;
		// @ts-ignore
		app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	})
	.catch((error) => {
		console.error("Failed to load Swagger document:", error);
	});
app.use("/users", UserRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

export default app;
