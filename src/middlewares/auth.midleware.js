const jwt = require("jsonwebtoken");
const { AppConfig } = require("../config/config");
const authSvc = require("../modules/auth/auth.service");
const { UserRole } = require("../config/constants");

const auth = (roles = null) => {
  return async (req, res, next) => {
    try {
      let token = req.headers.authorization;

      if (!token) {
        throw {
          code: 401,
          status: "UNAUTHORIZED",
          message: "Authorization token is required.",
        };
      }

      token = token.split(" ").pop();

      const data = jwt.verify(token, AppConfig.jwtSecret);

      // check token type
      if (data.type !== "Bearer") {
        throw {
          code: 403,
          status: "ACCESS_DENIED",
          message: "Bearer token expected.",
        };
      }

      // find user FIRST
      const userDetail = await authSvc.getSingleRowByFilter({
        _id: data.sub,
      });

      if (!userDetail) {
        throw {
          code: 404,
          status: "USER_NOT_FOUND",
          message: "User not found.",
        };
      }

      // role check AFTER user is found
      if (roles) {
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (
          userDetail.role !== UserRole.ADMIN &&
          !allowedRoles.includes(userDetail.role)
        ) {
          throw {
            code: 403,
            status: "ACCESS_DENIED",
            message: "You do not have permission to access this resource.",
          };
        }
      }

      // attach user
      req.loggedInUser =await authSvc.getUserPublicProfile(userDetail);

      next();
    } catch (exception) {
      let error = {
        code: 500,
        status: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong.",
      };

      if (exception.name === "TokenExpiredError") {
        error = {
          code: 401,
          status: "TOKEN_EXPIRED",
          message: "Token has expired.",
        };
      } else if (exception.name === "JsonWebTokenError") {
        error = {
          code: 401,
          status: "INVALID_TOKEN",
          message: "Invalid token.",
        };
      } else if (exception.code) {
        error = exception;
      }

      next(error);
    }
  };
};

module.exports = auth;