import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import UserRouter from "./routers/UserRouter";
import cors from "cors";
import fs from "node:fs/promises";
import { parse } from "yaml";
import swaggerUi from "swagger-ui-express";

export const app = express();
const swaggerDocument = parse(await fs.readFile("./swagger.yaml", "utf8"));

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

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/users", UserRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
