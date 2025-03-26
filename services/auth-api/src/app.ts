import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import AuthRouter from "./routers/AuthRouter";

export const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express 5 with TypeScript and tsx! coucou");
});

app.use("/auth", AuthRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
