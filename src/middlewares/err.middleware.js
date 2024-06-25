import { ApiError } from "../utils/ApiError.js";

const errHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statuscode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  console.error(err); // Log the error for debugging
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
  });
};

export { errHandler };
