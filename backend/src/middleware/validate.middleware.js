import { ApiError } from "#utils/ApiError";

/**
 * Generic request validation middleware.
 *
 * Accepts a Zod schema and validates the selected
 * part of the request.
 *
 * @param {ZodSchema} schema
 * @param {"body"|"params"|"query"} source
 */

const validate = (
  schema,
  source = "body",
) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(
        req[source],
      );

      /*
       * Replace original request data with
       * validated/transformed data.
       *
       * Example:
       * "USER@EMAIL.COM"
       *
       * becomes:
       *
       * "user@email.com"
       *
       * because of Zod transformations.
       */
      req[source] = validatedData;

      next();
    } catch (error) {
      /*
       * Zod validation failure
       */
      throw new ApiError(
        400,
        "Validation failed.",
        error.issues || [],
      );
    }
  };
};

export { validate };