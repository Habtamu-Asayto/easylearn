//Import user service
const categoryService = require("../services/courseCategoryService");
const db = require("../config/db");
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
      const cat = await categoryService.createCategory(catData)
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
      console.log(error);
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

async function updateCategory(req,res,next){
   const { id, category_name } = req.body;
   if (!category_name)
     return res.status(400).json({ message: "ID and name required" });

   const sql = "UPDATE course_category SET category_name=?, updated_at=NOW() WHERE category_id=?";
   db.query(sql, [category_name,id], (err, result) => {
     if (err)
       return res.status(500).json({ message: "Update error", error: err });
     res.json({ id, category_name });
   });
}

const deleteCategory = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM course_category WHERE category_id=?";
  db.query(sql, [id], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Delete error", error: err });
    res.json({ message: "Category deleted" });
  });
};


module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory
};