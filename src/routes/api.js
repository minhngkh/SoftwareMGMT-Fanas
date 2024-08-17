const express = require("express");
const router = express.Router();
const ApiController = require("../controllers/apiController");
const authenticated = require("../middleware/authenticated");

const multer = require("multer");
const storage = multer.memoryStorage(); // Store files in memory for processing
const upload = multer({ storage: storage });

router.get("/search-books", ApiController.searchBooks);
router.get("/filter-books", ApiController.filterBooks);
router.post(
  "/update-profile",
  upload.single("avatar"),
  ApiController.updateProfile,
);
router.get(
  "/favorite/:bookId",
  authenticated.require,
  ApiController.getFavorite,
);
router.post(
  "/favorite/:bookId",
  authenticated.require,
  ApiController.addFavorite,
);
router.post("/signup", ApiController.createNewCustomer);
router.delete(
  "/favorite/:bookId",
  authenticated.require,
  ApiController.removeFavorite,
);
router.post("/review", authenticated.require, ApiController.createReview);
router.get("/reviews/:bookId", ApiController.getReviewsByBookId);

module.exports = router;
