const Authentication = require("../config/Authentication");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const Author = require("../models/authorModel");
const createError = require("http-errors");

const {
  storage,
  getDownloadURL,
  dbFirestore,
} = require("../config/firebase.js");
const { firebaseAuthController } = require("./firebaseAuthController.js");

class siteController {
  //[GET] /
  index(req, res) {
    res.redirect("/homepage");
    // res.render("index", { layout: "main" });
  }

  //[GET] /homepage
  async homepage(req, res) {
    const sliders = await Book.getAllBooks();
    // console.log(sliders);

    if (!res.locals.isAuthenticated) {
      res.render("homepage", { layout: "base-with-nav", sliders: sliders });
      return;
    }

    const uid = res.locals.userUid;

    const userData = await User.getUser(uid);
    // console.log(userData);
    const favoriteGenres = userData.favoriteGenres;

    const suggestedBooks = sliders.filter((book) =>
      book.genres.some((genre) => favoriteGenres.includes(genre)),
    );

    // console.log(suggestedBooks);

    res.render("homepage", {
      layout: "base-with-nav",
      sliders: sliders,
      suggestedBooks: suggestedBooks,
      avatarPath: userData.avatarPath,
    });
  }

  //[GET] /signin
  signin(req, res) {
    console.log("getLogin");
    let messFailed = "";
    if (req.query.status === "failed") {
      messFailed = "Wrong username or password.";
    }
    res.render("signin", { layout: "base", messFailed });
  }

  //[POST] /signin
  async postSignin(req, res) {
    console.log("postLogin");

    const { message, status, userCredential, sessionCookie, expirationTime } =
      await Authentication.loginUser(req.body, () => {});

    if (userCredential) {
      // res.cookie("uid", userCredential.user.uid, {
      //   expires: new Date(Date.now() + 900000),
      //   httpOnly: true,
      // });

      const options = { maxAge: expirationTime, httpOnly: true, secure: true };
      res.cookie("session", sessionCookie, options);
    }

    if (status === 500) {
      res.redirect("/signin?status=failed");
    } else {
      res.redirect("/homepage");
    }
  }

  //[GET] /signup
  signup(req, res) {
    res.render("signup", { layout: "base" });
  }

  //[POST] /signup
  async postSignup(req, res) {
    console.log("postSignup");
    const formData = req.body;
    const newUser = {
      email: formData.email,
      password: formData.password,
    };

    const { message, status, userCredential } =
      await Authentication.registerUser(newUser, () => {});
    if (userCredential) {
      const userInfo = {
        userID: userCredential.user?.uid,
        avatarPath:
          "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
        email: req.body.email,
        role: "customer",
        favoriteGenres: req.body?.favoriteGenres ? req.body.favoriteGenres : [],
      };
      await User.createNewUser(userInfo, () => {});
    }
    res.redirect("/homepage");
  }

  //[GET] /search
  search(req, res) {
    res.render("search", { layout: "base-with-nav" });
  }

  //[GET] /search-books
  //For example /search-books?phrase=hoa
  async searchBooks(req, res) {
    const phrase = req.query.phrase;
    let foundBooks = [];

    await dbFirestore
      .collection("Books")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          let book = doc.data();
          if (
            book.bookName &&
            book.bookName.toLowerCase().includes(phrase.toLowerCase())
          ) {
            book.id = doc.id;
            foundBooks.push(book);
          }
        });
      });

    res.json(foundBooks);
  }

  //[GET] /detail
  async detail(req, res) {
    console.log(req.query);
    let bookId = req.query.id;
    var detail;

    let bookData = await Book.getBookById(bookId);
    // await dbFirestore
    //   .collection("Books")
    //   .get()
    //   .then((snapshot) => {
    //     let book = snapshot.docs.find((o) => o.id === bookId);
    //     detail = book.data();
    //     // console.log(detail);
    //   });

    let authorData = await Author.getAuthorById(bookData.author);
    // console.log(authorData);

    res.render("detail", {
      layout: "base-with-nav",
      detail: bookData,
      author: authorData,
    });
  }

  //[GET] /favorite
  favorite(req, res) {
    res.render("favorite", { layout: "base-with-nav" });
  }

  //[GET] /example
  example(req, res) {
    const exampleText = "muahahahaha";
    res.render("example", { layout: "example", exampleText });
  }

  //[GET] /get-audio-url
  async getAudio(req, res) {
    console.log(req.query);

    try {
      const filename = "sw" + req.query.chapters + ".mp3";
      const fileRef = storage.bucket().file("SnowWhite/" + filename);
      const url = await getDownloadURL(fileRef);
      res.json({ url });
    } catch (error) {
      console.error("Error fetching the download URL: ", error);
      res.status(500).send("Error fetching the download URL");
    }
  }

  //[GET] /login
  login(req, res, next) {
    res.render("login", { layout: "main" });
  }

  //[GET] /logout
  async logout(req, res, next) {
    const cookieSession = req.cookies.session || "";
    res.clearCookie("session");
    const result = await Authentication.logoutUser(cookieSession);

    if (result.success) {
      res.redirect("/homepage");
    } else {
      next(createError(500, result.message));
    }
  }

  playback(req, res, next) {
    res.render("playback", { layout: "base-with-nav" });
  }
}

module.exports = new siteController();
