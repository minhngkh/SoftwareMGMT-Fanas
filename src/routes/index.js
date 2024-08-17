const siteRouter = require("./site");
const profileRouter = require("./profile");
const apiRouter = require("./api.js");
const createError = require("http-errors");
const authenticated = require("../middleware/authenticated");
const { getAuthAdmin } = require("../config/firebase");
const { setCurrentNav } = require("../middleware/setNavProps.js");

const authAdmin = getAuthAdmin();

function route(app) {
  // Add authentication status into req.locals
  app.use((req, res, next) => {
    const session = req.cookies.session;
    if (!session) {
      res.locals.isAuthenticated = false;
      return next();
    }

    authAdmin
      .verifySessionCookie(session, true)
      .then((decodedClaims) => {
        res.locals.isAuthenticated = true;
        res.locals.userUid = decodedClaims.uid;
        next();
      })
      .catch(() => {
        res.locals.isAuthenticated = false;
        next();
      });
  });

  app.use("/", siteRouter);
  app.use(
    "/profile",
    authenticated.require,
    setCurrentNav("profile"),
    profileRouter,
  );
  app.use("/api/v1", apiRouter);

  app.use((_, __, next) => {
    next(createError(404));
  });

  // Error handler
  app.use((err, req, res, _) => {
    // Set locals, only providing error in development
    res.locals.status = err.status || 500;
    res.locals.message = err.status ? err.message : "Internal Server Error";
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(res.locals.status);
    res.render("error");
  });
}

module.exports = route;
