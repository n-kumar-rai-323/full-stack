const bodyValidator = (schema) => {
  return async (req, res, next) => {
    try {
      const response = await schema.validateAsync(req.body, {
        abortEarly: false,
      });

      req.body = response;
      next();
    } catch (exception) {
      let messageBag = {};

      // 🔥 SAFE CHECK (IMPORTANT)
      if (exception?.details && Array.isArray(exception.details)) {
        for (const val of exception.details) {
          let key = val.path?.[0];
          let msg = val.message;
          messageBag[key] = msg;
        }
      } else {
        messageBag.general = exception.message || "Validation error";
      }

      return next({
        details: messageBag,
        code: 400,
        message: "Validation Failed",
        status: "VALIDATION_FAILED",
      });
    }
  };
};

module.exports = bodyValidator;