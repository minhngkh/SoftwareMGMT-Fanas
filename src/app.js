const express = require('express');
const path = require('path');
const ip = require("ip");
const handleBars = require('express-handlebars');
require("dotenv").config();

const { storage, getDownloadURL } = require('./config/firebase.js');
const firebaseAuthController = require('./controllers/firebaseAuthController.js');

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

app.post('/register', firebaseAuthController.registerUser);
app.post('/login', firebaseAuthController.loginUser);
app.post('/logout', firebaseAuthController.logoutUser);

app.get('/', (req, res) => {
  //res.render('homepage', {layout: 'main'});
  //res.render('signup', {layout: 'main'});
  res.render('index', {layout: 'main'});
});

app.get('/get-audio-url', async (req, res) => {
    console.log(req.query);

    try {
        const filename = "sw" + req.query.chapters + ".mp3";
        const fileRef = storage.bucket().file('SnowWhite/' + filename);
        const url = await getDownloadURL(fileRef);
        res.json({ url });
    } catch (error) {
        console.error("Error fetching the download URL: ", error);
        res.status(500).send("Error fetching the download URL");
    }
});

app.get('/example', (req, res) => {
  const exampleText = "muahahahaha";
  res.render("example", { layout: "example", exampleText});
});

const PORT = 8080;

module.exports = app;
