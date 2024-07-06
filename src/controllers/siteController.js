const User = require('../models/userModel');

const { storage, getDownloadURL } = require("../config/firebase.js");
const {firebaseAuthController} = require("./firebaseAuthController.js");

class siteController {
  //[GET] /
  index(req, res) {
    res.render('index', {layout: 'main'});
  }

  //[GET] /search
  search(req, res) {
    res.render("search", {layout: 'main'});
  }

  //[GET] /detail
  detail(req, res) {
    res.render("detail", {layout: 'main'});
  }

  //[GET] /example
  example(req, res) {
    const exampleText = "muahahahaha";
    res.render("example", { layout: "example", exampleText});
  }

  //[GET] /get-audio-url
  async getAudio(req, res) {
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
  }
  

  
  //[GET] /signup
  signup(req, res) {
    res.render('signup', {layout: 'main'});

  }

  //[GET] /login
  login(req, res, next) {
    res.render('login', {layout: 'main'});
    
  }

  //[GET] /logout
  logout(req, res, next) {
    console.log("Loging out");
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('./login');
    });
  }
}


module.exports = new siteController;