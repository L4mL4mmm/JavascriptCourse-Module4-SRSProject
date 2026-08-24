/**
 * Helper function to send standard JSON responses.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - Success indicator
 * @param {string} message - Response message
 * @param {any} data - Data payload (optional)
 */
export const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};
