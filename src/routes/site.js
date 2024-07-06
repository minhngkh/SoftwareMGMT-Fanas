const express = require('express');
const router = express.Router();

const firebaseAuthController = require("../controllers/firebaseAuthController");
const siteController = require("../controllers/siteController");

// router.get('/register', siteController.register);
router.post('/register', firebaseAuthController.registerUser);

// router.get('/login', siteController.login);
router.post('/login', firebaseAuthController.loginUser);

router.post('/logout', firebaseAuthController.logoutUser);

router.get('/get-audio-url', siteController.getAudio);

router.get('/example', siteController.example);
router.get('/detail', siteController.detail);
router.get('/search', siteController.search);

router.get('/', siteController.index);

module.exports = router;