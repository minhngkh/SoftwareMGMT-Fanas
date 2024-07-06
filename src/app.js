const express = require('express');
const path = require('path');
const ip = require("ip");
const handleBars = require('express-handlebars');

require("dotenv").config();

const route = require('./routes/index.js');

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
console.log(path.join(__dirname, '../public'));

app.use(
    express.urlencoded({
      extended: true,
    })
);
app.use(express.json());

//Setup view engine with handlebars
app.engine('hbs', handleBars.engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      json: (content) => JSON.stringify(content)
    }
  }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource', 'views'));

route(app);

const PORT = 8080;

module.exports = app;
