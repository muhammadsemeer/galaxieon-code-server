import express, { Application } from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import logger from "morgan";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

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

export default app;
