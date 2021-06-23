import express, {
  Application,
  NextFunction,
  Request,
  Response,
  CookieOptions,
} from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import logger from "morgan";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { randomBytes } from "crypto";

config();

const app: Application = express();

export const cookieOption: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
};

const corsOption: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  exposedHeaders: ["set-cookie"],
};

// Cors and Helmet (CSP)
app
  .use(
    helmet({
      contentSecurityPolicy: false,
    })
  )
  .use(cors(corsOption));

// Middlewares
app
  .use(express.json({ limit: "5mb" }))
  .use(express.urlencoded({ limit: "5mb", extended: false }))
  .use(logger("dev"))
  .use(fileUpload())
  .use(cookieParser());

// Routers
import authRouter from "./routers/auth";
import adminRouter from "./routers/admin";
import instanceRouter from "./routers/instance";
import staticRouter from "./routers/static";

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/instance", instanceRouter);
app.use(staticRouter);
// app.use(express.static(path.join(__dirname, "public/instances")));

// Catch 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Route Not Found");
});

// Catch error
app.use((err: Error | any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json(err.message);
});

export default app;
