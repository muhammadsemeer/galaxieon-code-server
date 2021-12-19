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
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

config();

const app: Application = express();

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE),
    environment: process.env.NODE_ENV,
  });
}

export const cookieOption: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
};

const corsOption: CorsOptions =
  process.env.NODE_ENV === "development"
    ? {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        exposedHeaders: ["set-cookie"],
      }
    : {};

app
  .use(Sentry.Handlers.requestHandler())
  .use(Sentry.Handlers.tracingHandler())
  .use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false,
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
import templateRouter from "./routers/template";

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/instance", instanceRouter);
app.use("/template", templateRouter);
app.use(staticRouter);

// Catch 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Route Not Found");
});

app.use(Sentry.Handlers.errorHandler());

// Catch error
app.use((err: Error | any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json(err.message);
});

export default app;
