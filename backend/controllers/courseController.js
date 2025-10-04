const conn = require("../config/db");
// Get all users
const getAllCourse = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM Courses");
    if (!data || data[0].length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Course found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Course retrieved successfully",
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
const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query("SELECT * FROM Courses WHERE id = ?", [id]);
    if (!data || data[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Course found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Course by ID",
      error: error,
    });
  }
};

//Insert Question
const insertCourse = async (req, res) => {
  try {
    const { title, description, category_id, instructor_id } = req.body;
    if (!title || !description || !category_id || !instructor_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO Courses( title, description, category_id, instructor_id ) VALUES ( ?, ?, ?, ? )",
      [title, description, category_id, instructor_id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Course",
      });
    }
    res.status(201).json({
      success: true,
      message: "Course inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Course",
      error: error,
    });
  }
};
//Update Question
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM Courses WHERE id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Course ID",
      });
    }
    const { title, description, category_id, instructor_id } = req.body;
    const data = await conn.query(
      "UPDATE Courses SET title = ?,description = ?, category_id = ?, instructor_id = ?  WHERE id = ?",
      [title, description, category_id, instructor_id, id  ]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Course",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Course",
      error: error,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM Courses WHERE id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Course ID",
      });
    }
    const data = await conn.query("DELETE FROM Courses WHERE id = ?", [
      id,
    ]);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Course",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Course",
      error: error,
    });
  }
};
module.exports = {
  getAllCourse,
  getCourseById,
  insertCourse,
  updateCourse,
  deleteCourse,
};
