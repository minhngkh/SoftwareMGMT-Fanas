const express = require("express");
const router = express.Router();

const Book = require("../models/bookModel");
const User = require("../models/userModel");
const Author=require("../models/authorModel.js");
const Review=require("../models/reviewModel.js")
const firebaseAuthController = require("../controllers/firebaseAuthController");
const authenticateUser = require("../middleware/authenticateUser");
const profileController = require("../controllers/profileController");

router.get("/", async (req, res, _) => {
  const uid = res.locals.userUid;
  try {
    const userData = await User.getUser(uid);

    res.render("profile-info", {
      layout: "base-with-nav",
      title: "Profile",
      currentNav: "profile",
      user:{
        avatarPath: userData.avatarPath,
        email: userData.email
      },
    });
  }
  catch(error) {
    
  }
});

router.get("/history", (req, res, _) => {
  const mockData = {
    fullName: "Nguyen Van A",
    avatarUrl: "/assets/placeholders/avatar.png",
    history: Array(5).fill({
      title: "Thằng quỷ nhỏ",
      coverUrl: "/assets/placeholders/book-cover.png",
    }),
  };

  res.render("profile-list", {
    layout: "base-with-nav",
    title: "Reading history",
    currentNav: "profile",
    listName: "Đã xem",
    ...mockData,
  });
});

// FIX: require authenticated to access
router.get("/favorite", profileController.favorite);

module.exports = router;
