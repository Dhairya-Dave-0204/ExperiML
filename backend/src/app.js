import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { env } from "#config/env.config";
import { errorMiddleware } from "#middleware/error.middleware";

const app = express();

app.set("json replacer", (_key, value) =>
  typeof value === "bigint" ? value.toString() : value,
);

/*
 * ===============================================
 * CORS Configuration
 * ===============================================
 */

const corsOrigin = env.CORS_ORIGIN;

if (!corsOrigin) {
  throw new Error("CORS_ORIGIN missing in environment variables");
}

const allowedOrigins = corsOrigin.split(",").map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      /*
       * Allow requests without an Origin header.
       *
       * This includes tools such as Postman and
       * server-to-server requests.
       */
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    /*
     * Required for HttpOnly refresh-token cookies
     * to be sent with cross-origin requests.
     */
    credentials: true,
  }),
);

/*
 * ===============================================
 * Security Middleware
 * ===============================================
 */

app.use(helmet());

/*
 * ===============================================
 * Request Body Middleware
 * ===============================================
 */

app.use(
  express.json({
    limit: "16kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);

/*
 * ===============================================
 * Cookie Middleware
 * ===============================================
 *
 * Required for reading the refresh-token cookie:
 *
 * req.cookies.refreshToken
 */
app.use(cookieParser());

/*
 * ===============================================
 * Health / Root Route
 * ===============================================
 */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ExperiML Backend API",
    version: "1.0.0",
  });
});

/*
 * ===============================================
 * API Routes
 * ===============================================
 */

import authRouter from "#auth/auth.routes";
import projectRouter from "#project/project.routes";
import datasetRoutes from "#dataset/dataset.routes";
import experimentRoutes from "#experiment/experiment.routes";
import artifactRoutes from "#artifact/artifact.routes";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/projects", datasetRoutes);
app.use("/api/v1/projects", experimentRoutes);
app.use("/api/v1/projects", artifactRoutes);

/*
 * ===============================================
 * 404 Handler
 * ===============================================
 *
 * This must come after all valid application
 * routes so that unmatched requests reach here.
 */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
 * ===============================================
 * Global Error Middleware
 * ===============================================
 *
 * This must remain the final middleware so that
 * errors passed through next(error) are handled
 * centrally.
 */

app.use(errorMiddleware);

export { app };
