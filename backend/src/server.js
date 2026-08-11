import "dotenv";
import { app } from "./app.js";
import { env } from "#config/env.config.js";

dotenv.config({
  path: "./.env",
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION!");
  console.error(err);

  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION!");
  console.error(err);

  process.exit(1);
});

const PORT = env.PORT;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

const startServer = async () => {
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Connection URL http://localhost:${PORT}`);
      });

      return;
    } catch (error) {
      retryCount++;

      console.error(error.message);

      if (retryCount >= MAX_RETRIES) {
        console.error("Maximum retry attempts reached. Exiting process...");

        process.exit(1);
      }

      console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
};

startServer();
