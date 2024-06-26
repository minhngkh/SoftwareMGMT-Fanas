const express = require('express');
const path = require('path');
const ip = require("ip");
const handleBars = require('express-handlebars');
const { storage, getDownloadURL } = require('./firebase.js');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'resource', 'views')));

//Setup view engine with handlebars
app.engine('hbs', handleBars.engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      json: (content) => JSON.stringify(content),
      prodClassFromName: (prodName) => prodName.replaceAll(' ', '-'),
    }
  }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource', 'views'));

app.get('/', (req, res) => {
    //res.render('login');
    res.render('index', {layout: 'main'});

  })


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

const PORT = 8080;

module.exports = app;
