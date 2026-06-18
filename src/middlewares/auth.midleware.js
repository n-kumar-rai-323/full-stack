const jwt = require("jsonwebtoken");
const { AppConfig } = require("../config/config");

const auth = () => {
  return (req, res, next) => {
    try {
      let token = req.headers["authorization"];

      if (!token) {
        throw {
          code: 401,
          message: "Authorization token is required.",
          status: "UNAUTHORIZED",
        };
      }

      // Expected format: Bearer <token>
      token = token.split(" ").pop();

      const data = jwt.verify(token, AppConfig.jwtSecret);

      // Store decoded payload for later use
      req.authUser = data;

      next();
    } catch (exception) {
      let error = {
        code: 500,
        message: "Internal Server Error",
        status: "INTERNAL_SERVER_ERROR",
      };

      if (exception.name === "TokenExpiredError") {
        error = {
          code: 401,
          message: "Token has expired.",
          status: "TOKEN_EXPIRED",
        };
      } else if (exception.name === "JsonWebTokenError") {
        error = {
          code: 401,
          message: "Invalid token.",
          status: "INVALID_TOKEN",
        };
      } else if (exception.code) {
        error = exception;
      }

      next(error);
    }
  };
};

module.exports = auth;