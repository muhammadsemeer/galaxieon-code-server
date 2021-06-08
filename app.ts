import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import logger from "morgan";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config();

const app: Application = express();

const corsOption: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  exposedHeaders: ["set-cookie"],
};

// Cors and Helmet (CSP)
app.use(helmet()).use(cors(corsOption));

// Middlewares
app
  .use(express.json({ limit: "5mb" }))
  .use(express.urlencoded({ limit: "5mb", extended: false }))
  .use(logger("dev"))
  .use(fileUpload())
  .use(cookieParser());

// Routers
import authRouter from "./routers/auth";

app.use("/auth", authRouter);

// Catch 404
app.use((req: Request, res: Response,next: NextFunction) => {
  res.status(404).send("Route Not Found");
});

// Catch error
app.use((err: Error | any, req: Request, res: Response,next: NextFunction) => {
  (process.env.NODE_ENV as string) === "development"
    ? res.status(err.status || 500).json(err.message)
    : res.sendStatus(err.status || 500);
});

export default app;
