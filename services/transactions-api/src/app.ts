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
