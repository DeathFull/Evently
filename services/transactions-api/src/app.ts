import express from "express";
import type { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import TransactionRouter from "./routers/TransactionRouter";
import { loadSwaggerDocument } from "./utils/swagger";

const app = express();

app.use(express.json());

(async () => {
	try {
		const swaggerDocument = await loadSwaggerDocument();
		app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	} catch (error) {
		console.error("Failed to set up Swagger:", error);
	}
})();

app.use("/transactions", TransactionRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

export default app;
