const Authentication = require("../config/Authentication");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const Author = require("../models/authorModel");

const {
    storage,
    getDownloadURL,
    dbFirestore,
  } = require("../config/firebase.js");
const { firebaseAuthController } = require("./firebaseAuthController.js");
const { favorite } = require("./siteController.js");

class profileController {

    //[GET] /favorite
    async favorite(req, res){
        const cookieHeader = req.headers?.cookie;
        // console.log(cookieHeader);
        if (!cookieHeader) {
        // console.log("Error fetching, user is not authenticated");
        res.status(401).send("Error fetching, user is not authenticated");
        return;
        }
        const uid = res.locals.userUid;
    
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
                    email: userData.email,
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
                    email: userData.email,
                    avatarPath: userData.avatarPath,
                    favoriteList: favoriteBooks,
                },
            });
        } catch (error) {
            console.error("Error fetching favorite books: ", error);
            res.status(500).send("Error fetching favorite books");
        }
    }
}

module.exports = new profileController();
