import { sendResponse } from "../utils/response.js";

// middleware bat va xu ly loi tap trung
export const errorHandler = (err, req, res, next) => {
  console.error("Error caught by global handler:", err);

  // lay ma loi hoac mac dinh la 500
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // tra ve phan hoi loi cho client
  return sendResponse(res, statusCode, false, message);
};

