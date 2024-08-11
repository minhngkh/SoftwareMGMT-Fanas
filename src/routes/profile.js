const express = require("express");
const router = express.Router();

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

router.get("/favorite", (req, res, _) => {
  const mockData = {
    fullName: "Nguyen Van A",
    avatarPath: "/assets/placeholders/avatar.png",
    favoriteList: Array(5).fill({
      bookName: "Thằng quỷ nhỏ",
      coverPath: "/assets/placeholders/book-cover.png",
    }),
  };

  res.render("profile-list", {
    layout: "base-with-nav",
    title: "Reading history",
    currentNav: "profile",
    listName: "Yêu thích",
    user: mockData,
  });
});

module.exports = router;
