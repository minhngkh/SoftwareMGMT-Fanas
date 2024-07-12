const express = require("express");
const path = require("path");
const ip = require("ip");
const expressHbs = require("express-handlebars");
const hbsLayouts = require("handlebars-layouts");

require("dotenv").config();

const route = require("./routes/index.js");

const app = express();
app.use(express.static(path.join(__dirname, "../public")));
console.log(path.join(__dirname, "../public"));

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

//Setup view engine with handlebars
const hbs = expressHbs.create({
  extname: ".hbs",
  helpers: {
    sum: (a, b) => a + b,
    json: (content) => JSON.stringify(content),
    eq: (a, b) => a == b,
  },
});
hbsLayouts.register(hbs.handlebars);
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resource", "views"));

route(app);

module.exports = app;
