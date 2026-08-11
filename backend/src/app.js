import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet";

import { env } from "#config/env.config.js"

const app = express()

const corsOrigin = env.CORS_ORIGIN

if(!corsOrigin) {
    throw new Error("CORS_ORIGIN missing in environment variables");
}

const allowedOrigins = process.env.CORS_ORIGIN.split(",").map((origin) =>
  origin.trim(),
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(helmet());

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ExperiML Backend API",
    version: "1.0.0",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export { app };