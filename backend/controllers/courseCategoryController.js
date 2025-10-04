const conn = require("../config/db");
// Get all users
const getAllCategory = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM CourseCategories");
    if (!data || data[0].length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Course Category found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Course Category  retrieved successfully",
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: "Server Error",
    });
  }
};

//Get Question by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query(
      "SELECT * FROM CourseCategories WHERE id = ?",
      [id]
    );
    if (!data || data[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Course Category found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course Category  fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Course Category  by ID",
      error: error,
    });
  }
};

//Insert Question
const insertCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO CourseCategories ( name ) VALUES ( ? )",
      [ name ]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Course Category ",
      });
    }
    res.status(201).json({
      success: true,
      message: "Course Category inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Course Category ",
      error: error,
    });
  }
};
//Update Question
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM CourseCategories WHERE id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Course Category ID",
      });
    }
    const { name } = req.body;
    const data = await conn.query(
      "UPDATE CourseCategories SET name = ? WHERE id = ?",
      [ name, id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Course Category ",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course Category updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Course Category",
      error: error,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM CourseCategories WHERE id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Course Category ID",
      });
    }
    const data = await conn.query(
      "DELETE FROM CourseCategories WHERE id = ?",
      [id]
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Course Category",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course Category deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Course Category",
      error: error,
    });
  }
};
module.exports = {
  getAllCategory,
  getCategoryById,
  insertCategory,
  updateCategory,
  deleteCategory,
};
