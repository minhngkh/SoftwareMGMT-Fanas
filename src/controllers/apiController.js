const Book = require("../models/bookModel");
const User = require("../models/userModel");
const Author=require("../models/authorModel.js");
const Review=require("../models/reviewModel.js")
const { storage, getDownloadURL } = require("../config/firebase.js");
const Authentication = require("../config/Authentication/index.js");

class ApiController {
    //[GET] /search-books
    //For example /api/v1/search-books?phrase=hoa
    async searchBooks(req, res) {
        const phrase = req.query.phrase;
    
        if (!phrase) {
            return res.status(400).json({ error: "Query parameter 'phrase' is required." });
        }
    
        try {
            const books = await Book.getAllBooks();
    
            const filteredBooks = books.filter(book => 
                book.bookName && book.bookName.toLowerCase().includes(phrase.toLowerCase())
            );
    
            const foundBooks = await Promise.all(filteredBooks.map(async (book) => {
                const author = await Author.getAuthorById(book.author);
                return {
                    ...book,
                    authorName: author.name, // Include author's name in the response
                };
            }));
    
            res.json(foundBooks);
        } catch (error) {
            console.error("Error searching books:", error);
            res.status(500).json({ error: "Error searching books." });
        }
    }

    //[GET] /filter-books
    //For example /api/v1/filter-books?genre=Tiểu thuyết
    async filterBooks(req, res) {
        const genre = req.query.genre;
    
        if (!genre) {
            return res.status(400).json({ error: "Query parameter 'genre' is required." });
        }
    
        try {
            const books = await Book.getAllBooks();
    
            const filteredBooks = books.filter(book => 
                book.genres && book.genres.includes(genre)
            );
    
            const foundBooks = await Promise.all(filteredBooks.map(async (book) => {
                const author = await Author.getAuthorById(book.author);
                return {
                    ...book,
                    authorName: author.name, // Include author's name in the response
                };
            }));
    
            res.json(foundBooks);
        } catch (error) {
            console.error("Error filtering books:", error);
            res.status(500).json({ error: "Error filtering books." });
        }
    }

    //[POST] /api/v1/update-profile
    //For example, Make form data:
    //userID: IqpjHNgIprRI4GesjrzHTrk8rrO2
    //favoriteGenres: ["Kinh dị","Tiểu thuyết"]
    //avatar (file): Upload any image file
    async updateProfile(req, res) {
        const { userID, favoriteGenres } = req.body;
        const file = req.file;
        if (!userID || !favoriteGenres) {
            return res
                .status(400)
                .json({ message: "Missing required fields" });
        }

        let updateInfo = { favoriteGenres };

        if (file) {
            // Handle file upload
            const basename = file.originalname.split(".")[0];
            const ext = file.originalname.split(".").pop();
            const timestamp = Date.now();
            const filename = `${basename}_${timestamp}.${ext}`;
            const filePath = `Customers/${filename}`;

            // Upload file to Firebase Storage
            const blob = storage.bucket().file(filePath);
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });

            blobStream.on("error", (error) => {
                console.error("Error uploading file to Firebase Storage:", error);
                next(error);
            });

            blobStream.on("finish", async () => {
                try {
                    const url = await getDownloadURL(blob);
                    updateInfo.avatarPath = url;

                    // Update user with avatar and genres
                    await User.updateUser(userID, updateInfo);
                    res.status(200).json({ message: "Profile updated successfully." });
                } catch (error) {
                    console.error("Error getting download URL:", error);
                    next(error);
                }
            });

            blobStream.end(file.buffer);
        } else {
            try {
                await User.updateUser(userID, updateInfo);
                res.status(200).json({ message: "Profile updated successfully." });
            } catch (error) {
                console.error("Error updating profile:", error);
                next(error);
            }
        }
    }

    //[GET] /favorite
    //For example /api/v1/favorite
    //in body: bookId = abcxyz
    async getFavorite(req, res) {
        const bookId = req.params.bookId;
        // console.log("get /favorite id =" + bookId);

        const cookieHeader = req.headers?.cookie;
        // console.log(cookieHeader);
        if (!cookieHeader) {
            // console.log("Error fetching, user is not authenticated");
            res.status(401).send("Error fetching, user is not authenticated");
            return;
        }
        const uid = cookieHeader.split('=')[1];

        let userData = await User.getUser(uid);
        if (!userData) {
            res.status(404).send("User is not found!");
            // console.log("User is not found!");
            return;
        }

        let favoriteList = userData.favoriteList;
        var index = favoriteList.indexOf(bookId);
        try {
            if (index !== -1) {
                res.status(200).send("Book has already been in favorite list");
                return;
            } else {
                res.status(404).send("Book is not found in favorite list");
                // console.log("Book is not found in favorite list");
                return;
            }
        } catch (error) {
            // console.error("Error fetching the favorite api get request: ", error);
            res.status(500).send("Error fetching the favorite api get request");
        }
    }

    //[POST] /favorite
    //For example /api/v1/favorite
    //in body: bookId = abcxyz
    async addFavorite(req, res) {
        const bookId = req.params.bookId;
        // console.log("post /favorite id =" + bookId);

        const cookieHeader = req.headers?.cookie;
        // console.log(cookieHeader);
        if (!cookieHeader) {
            // console.log("Error fetching, user is not authenticated");
            res.status(401).send("Error fetching, user is not authenticated");
            return;
        }
        const uid = cookieHeader.split('=')[1];

        let userData = await User.getUser(uid);
        if (!userData) {
            res.status(404).send("User is not found!");
            return;
        }

        let favoriteList = userData.favoriteList;
        var index = favoriteList.indexOf(bookId);
        if (index !== -1) {
            res.status(409).send("Book has already been in favorite list");
            return;
        } else {
            favoriteList.push(bookId);
        }

        let updateInfo = { favoriteList: favoriteList };
        try {
            await User.updateUser(uid, updateInfo);
            res.status(200).json({ message: "Favorite list updated successfully." });
        } catch (error) {
            // console.error("Error fetching the favorite list add request: ", error);
            res.status(500).send("Error fetching the favorite list add request");
        }
    }

    //[DELETE] /favorite
    //For example /api/v1/favorite
    //in body: bookId = abcxyz
    async removeFavorite(req, res) {
        const bookId = req.params.bookId;
        // console.log("delete /favorite id =" + bookId);

        const cookieHeader = req.headers?.cookie;
        // console.log(cookieHeader);
        if (!cookieHeader) {
            // console.log("Error fetching, user is not authenticated");
            res.status(401).send("Error fetching, user is not authenticated");
            return;
        }
        const uid = cookieHeader.split('=')[1];

        let userData = await User.getUser(uid);

        if (!userData) {
            res.status(404).send("User is not found!");
            return;
        }

        let favoriteList = userData.favoriteList;
        var index = favoriteList.indexOf(bookId);
        if (index !== -1) {
            favoriteList.splice(index, 1);
        } else {
            res.status(404).send("Book is not found in favorite list");
            return;
        }

        let updateInfo = { favoriteList: favoriteList };
        try {
            await User.updateUser(uid, updateInfo);
            res.status(200).json({ message: "Favorite list updated successfully." });
        } catch (error) {
            // console.error("Error fetching the favorite list remove request: ", error);
            res.status(500).send("Error fetching the favorite list remove request");
        }
    }

    async createNewCustomer(req, res, next) {
        const formData = req.body;
        console.log(formData);
        const newUser = {
            email: formData.email,
            password: formData.password,
        };
        try {
            const { message, status, userCredential } =
                await Authentication.registerUser(newUser, () => { });
            if (userCredential) {
                const userInfo = {
                    userID: userCredential.user?.uid,
                    avatarPath:
                        "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
                    email: req.body.email,
                    role: "customer",
                    favoriteGenres: req.body?.favoriteGenres ? req.body.favoriteGenres : [],
                };
                await User.createNewUser(userInfo, () => { });
                res.status(200).json({ message: "Create new user successfully." });
            }
            else {
                res.status(409).json({ message: "User already existes." });
            }
        } catch (error) {
            console.error("Error create new user:", error);
            res.status(409).json({ message: "User already existes." });
        }
    }

    //[POST] /api/v1/review
    async createReview(req, res) {
        const { bookID, reviewContent } = req.body;
        const uid = req.cookies.uid;
    
        if (!bookID || !reviewContent) {
            return res.status(400).json({ error: "bookID and reviewContent are required." });
        }
    
        if (!uid) {
            return res.status(401).json({ error: "User is not authenticated." });
        }
    
        const reviewInfo = {
            bookID,
            userID: uid,
            reviewContent,
        };
    
        try {
            await Review.createReview(reviewInfo);
            res.status(201).json({ message: "Review created successfully." });
        } catch (error) {
            console.error("Error creating review:", error);
            res.status(500).json({ error: "Error creating review." });
        }
    }

    //[GET] /api/v1/reviews/:bookId
    //Example data response:
    // [
    //     {
    //       "id": "HU4zwg2OjWNo7tYZt6qj",
    //       "createdAt": "Monday, August 12, 2024",
    //       "reviewContent": "Sách rất hay, 10 điểm.",
    //       "userID": "IqpjHNgIprRI4GesjrzHTrk8rrO2",
    //       "bookID": "xrBHRG605RuVb4qoAc7B",
    //       "userEmail": "thanhthiennhan@gmail.com"
    //     }
    // ]
    async getReviewsByBookId(req, res) {
        const bookId = req.params.bookId;
    
        try {
            const reviews = await Review.getReviewsByBookId(bookId);
            
            const foundReviews = await Promise.all(reviews.map(async (review) => {
                const user = await User.getUser(review.userID);
                return {
                    ...review,
                    userEmail: user.email
                };
            }));
            
            res.json(foundReviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            res.status(500).json({ error: "Error fetching reviews." });
        }
    }
    
}

module.exports = new ApiController();
