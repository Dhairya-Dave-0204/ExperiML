import { app } from "./app.js";

import { env } from "#config/env.config";
import { prisma } from "#clients/prisma.client";

const PORT = env.PORT;

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

let server;
let isShuttingDown = false;

/*
  --------------------------------------------------
  Process-Level Error Handling
  --------------------------------------------------
*/
process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION!");
  console.error(error);

  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("UNHANDLED REJECTION!");
  console.error(error);

  process.exit(1);
});

/*
  --------------------------------------------------
  Utility
  --------------------------------------------------
*/
function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/*
  --------------------------------------------------
  Database Connection
  --------------------------------------------------
*/
async function connectDatabase() {
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      await prisma.$connect();

      console.log("Database connection established.");

      return;
    } catch (error) {
      retryCount++;

      console.error(
        `Database connection failed (attempt ${retryCount}/${MAX_RETRIES}).`,
      );

      console.error(error);

      if (retryCount >= MAX_RETRIES) {
        throw new Error("Maximum database connection attempts reached.");
      }

      console.log(
        `Retrying database connection in ${RETRY_DELAY / 1000} seconds...`,
      );

      await delay(RETRY_DELAY);
    }
  }
}

/*
  --------------------------------------------------
  Server Startup
  --------------------------------------------------
*/

async function startServer() {
  try {
    /*
      Database must be available before
      the application starts accepting requests.
    */
    await connectDatabase();

    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Connection URL: http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("HTTP SERVER ERROR!");
      console.error(error);

      process.exit(1);
    });
  } catch (error) {
    console.error("SERVER STARTUP FAILED!");
    console.error(error);

    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Failed to disconnect from database.");
      console.error(disconnectError);
    }

    process.exit(1);
  }
}

/*
  --------------------------------------------------
  Graceful Shutdown
  --------------------------------------------------
*/

async function gracefulShutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`\n${signal} received.`);
  console.log("Starting graceful shutdown...");

  /*
    Stop accepting new HTTP connections.

    Existing requests are allowed to finish.
  */
  if (server) {
    await new Promise((resolve) => {
      server.close((error) => {
        if (error) {
          console.error("Error while closing HTTP server.");
          console.error(error);
        } else {
          console.log("HTTP server closed.");
        }

        resolve();
      });
    });
  }

  /*
    Close Prisma's connection pool.
  */
  try {
    await prisma.$disconnect();

    console.log("Database connection pool closed.");
    console.log("Graceful shutdown completed.");

    process.exit(0);
  } catch (error) {
    console.error("Error while disconnecting from database.");
    console.error(error);

    process.exit(1);
  }
}

/*
  --------------------------------------------------
  OS Signal Handlers
  --------------------------------------------------
*/
process.on("SIGINT", () => {
  gracefulShutdown("SIGINT");
});

process.on("SIGTERM", () => {
  gracefulShutdown("SIGTERM");
});

/*
  --------------------------------------------------
  Start Application
  --------------------------------------------------
*/
startServer();
