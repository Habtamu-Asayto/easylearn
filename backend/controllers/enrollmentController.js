const conn = require("../config/db");
// Get all users
const getAllEnrollments = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM Enrollments");
    if (!data || data[0].length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Enrollment found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Enrollment retrieved successfully",
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
const getEnrollmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query("SELECT * FROM Enrollments  WHERE id = ?", [
      id,
    ]);
    if (!data || data[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Enrollment found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Enrollment fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Enrollment by ID",
      error: error,
    });
  }
};

//Insert Question
const insertEnrollment = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    if (!student_id || !course_id ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO Enrollments(student_id, course_id  ) VALUES ( ?, ?)",
      [student_id, course_id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Enrollment",
      });
    }
    res.status(201).json({
      success: true,
      message: "Enrollment inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Enrollment",
      error: error,
    });
  }
};
//Update Question
const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM Enrollments WHERE id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Enrollment ID",
      });
    }
    const { student_id, course_id } = req.body;
    const data = await conn.query(
      "UPDATE Enrollments SET student_id = ?, course_id=? WHERE id = ?",
      [student_id, course_id, id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Enrollment",
      });
    }
    res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Enrollment",
      error: error,
    });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM Enrollments WHERE id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Enrollment ID",
      });
    }
    const data = await conn.query("DELETE FROM Enrollments WHERE id = ?", [id]);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Enrollment",
      });
    }
    res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Enrollment",
      error: error,
    });
  }
};
module.exports = {
  getAllEnrollments,
  getEnrollmentById,
  insertEnrollment,
  updateEnrollment,
  deleteEnrollment
};
