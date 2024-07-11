const siteRouter = require("./site");
const profileRouter = require("./profile");

function route(app) {
  app.use("/", siteRouter);

  app.use("/profile", profileRouter);
}

module.exports = route;
