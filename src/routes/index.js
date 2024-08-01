const siteRouter = require("./site");
const profileRouter = require("./profile");
const apiRouter=require("./api.js")

function route(app) {
  app.use("/", siteRouter);

  app.use("/profile", profileRouter);
  app.use("/api/v1",apiRouter);
}

module.exports = route;
