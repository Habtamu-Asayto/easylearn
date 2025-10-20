// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the install router
const installRouter = require("./installRoutes");
// Import the user routes
const userRouter = require("./UserRoutes");

// Import the category routes
const categoryRouter = require("./courseCategoryRoutes");
// Import the category routes
const courseRouter = require("./courseRoutes");
router.use(courseRouter);

 
// Message
const chatRouter = require("./chatRoute");
router.use(chatRouter);

const newsRouter = require("./newsRoutes");
router.use(newsRouter);

const authRoutes = require("./auth.routes");
router.use("/api/auth", authRoutes);

//Import Login route
const loginRouter = require("./loginRoutes");

// Add the install router to the main router
router.use(installRouter);

// Add the user routes to the main router
router.use(userRouter);

// Add the user routes to the main router
router.use(categoryRouter);

//Add Login route
router.use(loginRouter);
// Export the router
module.exports = router;
