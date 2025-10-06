// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the install router
const installRouter = require("./installRoutes");
// Import the employee routes 
const userRouter = require("./UserRoutes"); 
// Import the employee routes 
const categoryRouter = require("./courseCategoryRoutes"); 

//Import Login route
const loginRouter = require("./loginRoutes")
// Add the install router to the main router
router.use(installRouter);
// Add the user routes to the main router
router.use(userRouter);
//Add Login route
router.use(loginRouter)
// Export the router
module.exports = router;
