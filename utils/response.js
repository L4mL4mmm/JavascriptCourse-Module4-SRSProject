// chuan hoa dinh dang phan hoi json tra ve cho client
export const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

