const conn = require("../config/db");
// Get all users
const getAllReviews = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM CourseReviews");
    if (!data || data[0].length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Review found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Review retrieved successfully",
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
const getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query("SELECT * FROM CourseReviews  WHERE id = ?", [
      id,
    ]);
    if (!data || data[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Review found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Review by ID",
      error: error,
    });
  }
};

//Insert Question
const insertReview = async (req, res) => {
  try {
    const { course_id, student_id, rating, comment } =
      req.body;
    if (!course_id || !student_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO CourseReviews(course_id, student_id, rating, comment) VALUES ( ?, ?, ?, ?)",
      [course_id, student_id, rating, comment]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Review",
      });
    }
    res.status(201).json({
      success: true,
      message: "Review inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Review",
      error: error,
    });
  }
};
//Update Question
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM CourseReviews WHERE id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Review ID",
      });
    }
    const { course_id, student_id, rating, comment } = req.body;
    const data = await conn.query(
      "UPDATE CourseReviews SET course_id=?, student_id = ?, rating = ?, comment = ?, updated_at = NOW() WHERE id = ?",
      [course_id, student_id, rating, comment, id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Review",
      });
    }
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Review",
      error: error,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM CourseReviews WHERE id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Review ID",
      });
    }
    const data = await conn.query("DELETE FROM CourseReviews WHERE id = ?", [
      id,
    ]);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Review",
      });
    }
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Review",
      error: error,
    });
  }
};
module.exports = {
  getAllReviews,
  getReviewById,
  insertReview,
  updateReview,
  deleteReview
};
