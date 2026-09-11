import axios from "axios";

import { env } from "#config/env.config";

export const fastApiClient = axios.create({
  baseURL: env.ML_SERVICE_URL,
  headers: {
    "X-Internal-Service-Key": env.ML_SERVICE_INTERNAL_SERVICE_KEY,
  },
});