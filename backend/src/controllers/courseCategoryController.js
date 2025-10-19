//Import user service
const categoryService = require("../services/courseCategoryService");
const db = require("../config/db");
//Create User
async function createCategory(req, res, next) {
  // check if token arives
  // console.log(req.headers);
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
      const cat = await categoryService.createCategory(catData);
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
      // console.log(error);
      res.status(400).json({
        error: "Something went wrong!",
      });
    }
  }
}

async function getAllCategory(req, res, next) {
  const categories = await categoryService.getAllCategory();
  if (!categories) {
    res.status(400).json({
      error: "Failed to get all categories!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: categories,
    });
  }
}

async function updateCategory(req, res, next) {
  try {
    const categoryData = req.body;
    const courseId = req.params.id;
    const updated = await categoryService.updateCategory(
      courseId,
      categoryData
    );
    if (!updated) {
      return res.status(400).json({ error: "Failed to update course!" });
    }

    res
      .status(200)
      .json({ status: true, message: "Course updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}

async function deleteCategory(req, res) {
  const categoryId = req.params.id;
  // console.log("1st:", courseId);?
  if (!categoryId) {
    return res
      .status(400)
      .json({ status: false, error: "category Id is required" });
  }

  try {
    const deleted = await categoryService.deleteCategory(categoryId);
    console.log(categoryId);
    if (deleted) {
      return res
        .status(200)
        .json({ status: true, message: "Course deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ status: false, error: "Course not found or already deleted" });
    }
  } catch (err) {
    console.error("Controller error:", err);
    return res
      .status(500)
      .json({ status: false, error: "Something went wrong" });
  }
}

module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
