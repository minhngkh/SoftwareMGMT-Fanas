const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/apiController");
const authenticateUser = require("../middleware/authenticateUser");

const multer = require("multer");
const storage = multer.memoryStorage(); // Store files in memory for processing
const upload = multer({ storage: storage });

router.get("/search-books", ApiController.searchBooks);
router.get("/filter-books", ApiController.filterBooks);
router.post("/update-profile", upload.single("avatar"), ApiController.updateProfile);
router.post("/favorite", ApiController.addFavorite);
router.delete("/favorite", ApiController.removeFavorite);

module.exports = router;
