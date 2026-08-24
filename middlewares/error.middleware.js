import { sendResponse } from "../utils/response.js";

/**
 * Global Error Handler middleware.
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error caught by global handler:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return sendResponse(res, statusCode, false, message);
};
