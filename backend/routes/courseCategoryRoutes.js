// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the employee controller
const categoryController = require("../controllers/courseCategoryController");  
// Import middleware 
const authMiddleware = require("../middlewares/auth.middleware");

 // we can restrict on both back and front end
//User Routes 
router.post(
  "/api/category",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  categoryController.createCategory
);
module.exports = router;
