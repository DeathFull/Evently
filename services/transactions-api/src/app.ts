import express from "express";
import type { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { loadSwaggerDocument } from "./utils/swagger";
import TransactionRouter from "./routers/TransactionRouter";

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
