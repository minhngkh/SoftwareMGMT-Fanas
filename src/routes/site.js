const express = require("express");
const router = express.Router();

const firebaseAuthController = require("../controllers/firebaseAuthController");
const authenticateUser = require("../middleware/authenticateUser");
const siteController = require("../controllers/siteController");

// router.get('/register', siteController.register);

// router.get('/login', siteController.login);
router.post("/login", firebaseAuthController.loginUser);

router.post("/logout", firebaseAuthController.logoutUser);

router.post("/change-password", firebaseAuthController.changePassword);

router.get("/get-audio-url", siteController.getAudio);

router.get("/example", siteController.example);
router.get("/detail", siteController.detail);
router.get("/search", siteController.search);

router.get("/homepage", siteController.homepage);
router.get("/logout", siteController.logout);
router.get("/signin", siteController.signin);
router.post("/signin", siteController.postSignin);
router.get("/signup", siteController.signup);
router.post("/signup", siteController.postSignup);

router.get("/search-books", siteController.searchBooks);
router.get("/playback", siteController.playback);

router.get("/", siteController.index);

function isLoggedIn(req, res, next) {
  console.log("Authenticate checking");

  const cookieHeader = req.headers?.cookie;
  // console.log(cookieHeader);

  if (typeof cookieHeader !== "undefined") {
    return next();
  } else {
    res.redirect("/signin");
  }
}
module.exports = router;
