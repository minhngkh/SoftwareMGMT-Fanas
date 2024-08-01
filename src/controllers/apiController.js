const Book = require("../models/bookModel");
const User = require("../models/userModel");
const { storage, getDownloadURL } = require("../config/firebase.js");

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
            const foundBooks = books.filter(book =>
                book.bookName && book.bookName.toLowerCase().includes(phrase.toLowerCase())
            );
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
            const foundBooks = books.filter(book =>
                book.genres && book.genres.includes(genre)
            );
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
}

module.exports = new ApiController();
