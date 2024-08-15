const express = require("express");
const router = express.Router();

router.get("/", (req, res, _) => {
  res.render("test/test", {
    layout: "base",
  });
});

module.exports = router;
