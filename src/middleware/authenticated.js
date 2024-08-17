const createError = require("http-errors");

// Continue if authenticated
exports.require = (_, res, next) => {
  if (!res.locals.isAuthenticated) {
    return next(createError(401));
  }
  next();
};

// Redirect to destination if authenticated
// If no destination is provided, redirect to the "next" parameter in query or root
exports.redirect = (destination = null) => {
  return (req, res, next) => {
    if (res.locals.isAuthenticated) {
      return res.redirect(destination || req.query.next || "/");
    }
    next();
  };
};

// Block if authenticated
exports.block = (_, res, next) => {
  if (res.locals.isAuthenticated) {
    return next(createError(403));
  }
  next();
};
