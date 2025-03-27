import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import TransactionRouter from "./routers/TransactionRouter";

export const app = express();

app.use(express.json());

app.use("/transaction", TransactionRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { loadSwaggerDocument } from "./utils/swagger";
import TransactionRouter from "./routers/TransactionRouter";

const app = express();

app.use(cors());
app.use(express.json());

// Set up Swagger documentation
(async () => {
  try {
    const swaggerDocument = await loadSwaggerDocument();
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (error) {
    console.error("Failed to set up Swagger:", error);
  }
})();

app.use("/transactions", TransactionRouter);

export default app;
