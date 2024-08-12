const express = require("express");
const router = express.Router();

const firebaseAuthController = require("../controllers/firebaseAuthController");
const authenticateUser = require("../middleware/authenticateUser");
const profileController = require("../controllers/profileController");

router.get("/", (req, res, _) => {
  const mockData = {
    fullName: "Nguyen Van A",
    avatarUrl: "/assets/placeholders/avatar.png",
  };

  res.render("profile-info", {
    layout: "base-with-nav",
    title: "Profile",
    currentNav: "profile",
    ...mockData,
  });
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
