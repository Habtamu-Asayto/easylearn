//Import user service
const categoryService = require("../services/courseCategoryService");
//Create User
async function createCategory(req, res, next) {
  // check if token arives
  console.log(req.headers);
  // Check if User email already exists in the database
  const categoryExists = await categoryService.checkIfCategoryExists(
    req.body.category_name
  );
  // If user exists, send a response to the client
  if (categoryExists) {
    res.status(400).json({
      error: "This category is created before!",
    });
  } else {
    try {
      const catData = req.body;
      // Create the user
      const cat = await userService.createUser(catData);
      if (!cat) {
        res.status(400).json({
          error: "Failed to add category!",
        });
      } else {
        res.status(200).json({
          status: "true",
        });
      }
    } catch (error) {
      console.log(err);
      res.status(400).json({
        error: "Something went wrong!",
      });
    }
  }
}

module.exports = {
  createCategory
}