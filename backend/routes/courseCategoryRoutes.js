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
  "/category",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  categoryController.createCategory
);

router.get(
  "/category",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  categoryController.getAllCategory
);
//Update Routes
router.put(
  "/category/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  categoryController.updateCategory
);
router.delete(
  "/category/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  categoryController.deleteCategory
);

module.exports = router;
