const express = require("express");
const router = express.Router();

// const firebaseAuthController = require("../controllers/firebaseAuthController");
const siteController = require("../controllers/siteController");
const authenticated = require("../middleware/authenticated");
const { setCurrentNav } = require("../middleware/setNavProps");

// router.get('/register', siteController.register);

// router.get('/login', siteController.login);
// router.post(
//   "/login",
//   authenticated.redirect("/"),
//   firebaseAuthController.loginUser,
// );

// router.post(
//   "/logout",
//   authenticated.require,
//   firebaseAuthController.logoutUser,
// );

// router.post(
//   "/change-password",
//   authenticated.require,
//   firebaseAuthController.changePassword,
// );

router.get("/get-audio-url", siteController.getAudio);

router.get("/example", siteController.example);
router.get("/detail", siteController.detail);
router.get("/search", setCurrentNav("search"), siteController.search);

router.get("/homepage", setCurrentNav("home"), siteController.homepage);
router.get("/logout", authenticated.require, siteController.logout);
router.get(
  "/signin",
  authenticated.redirect(),
  setCurrentNav("profile"),
  siteController.signin,
);
router.post("/signin", siteController.postSignin);
router.get(
  "/signup",
  authenticated.block,
  setCurrentNav("profile"),
  siteController.signup,
);
router.post("/signup", siteController.postSignup);
router.get(
  "/forgot-password",
  authenticated.block,
  siteController.resetPassword,
);

router.get("/search-books", siteController.searchBooks);
router.get("/playback", siteController.playback);

router.get("/", siteController.index);

module.exports = router;
