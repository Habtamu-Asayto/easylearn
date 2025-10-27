const express = require("express");

const router = express.Router();
// Import middleware
const authMiddleware = require("../middlewares/auth.middleware");
const newsController = require("../controllers/newsController");

router.post(
  "/news",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  newsController.createNews
);

router.get(
  "/news-list",
  [authMiddleware.verifyToken, authMiddleware.forAll],
  newsController.getNews
);
module.exports = router;
