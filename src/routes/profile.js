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

router.get("/favorite", async (req, res, _) => {
  const cookieHeader = req.headers?.cookie;
  // console.log(cookieHeader);
  if (!cookieHeader) {
    // console.log("Error fetching, user is not authenticated");
    res.status(401).send("Error fetching, user is not authenticated");
    return;
  }
  const uid = cookieHeader.split("=")[1];

  let userData = await User.getUser(uid);
  if (!userData) {
    res.status(404).send("User is not found!");
    return;
  }

  try {
    let userData = await User.getUser(uid);

    if (!userData.favoriteList || userData.favoriteList.length === 0) {
      res.render("profile-list", {
        layout: "base-with-nav",
        title: "Reading history",
        currentNav: "profile",
        listName: "Yêu thích",
        user: {
          fullName: userData.fullName,
          avatarPath: userData.avatarPath,
          favoriteList: [],
        },
      });
      return;
    }

    let favoriteBooks = await Promise.all(
      userData.favoriteList.map((bookId) => Book.getBookById(bookId))
    );

    res.render("profile-list", {
      layout: "base-with-nav",
      title: "Reading history",
      currentNav: "profile",
      listName: "Yêu thích",
      user: {
        fullName: userData.fullName,
        avatarPath: userData.avatarPath,
        favoriteList: favoriteBooks.map((book) => ({
          bookName: book.bookName,
          coverPath: book.coverPath,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching favorite books: ", error);
    res.status(500).send("Error fetching favorite books");
  }
});

module.exports = router;
