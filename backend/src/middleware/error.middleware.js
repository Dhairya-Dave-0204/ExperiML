import { ApiError } from "#utils/ApiError";

const errorMiddleware = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error.";
  let errors = [];

  /*
    -----------------------------------------------
    Custom API Error
    -----------------------------------------------
  */
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  } else {
    /*
    -----------------------------------------------
    Unexpected Error
    -----------------------------------------------
  */
    console.error("UNEXPECTED ERROR!");
    console.error(error);
  }

  /*
    -----------------------------------------------
    Response
    -----------------------------------------------
  */
  return res.status(statusCode).json({
    statusCode,
    data: null,
    message,
    success: false,
    errors,
  });
};

export { errorMiddleware };
  