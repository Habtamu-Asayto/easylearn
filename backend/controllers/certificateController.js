const conn = require("../config/db");
// Get all users
const getAllCertificates = async (req, res) => {
  try {
    const data = await conn.query("SELECT * FROM Certificates");
    if (!data || data[0].length === 0) {
      return res
        .status(404)
        .json({ sucess: false, message: "No Certificate found" });
    }
    res.status(200).json({
      sucess: true,
      message: "Certificate retrieved successfully",
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
const getCertificateById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await conn.query("SELECT * FROM Certificates WHERE id = ?", [
      id,
    ]);
    if (!data || data[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Certificates found with the given ID",
      });
    }
    res.status(200).json({
      success: true,
      message: "Certificates fetched successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting Certificates by ID",
      error: error,
    });
  }
};

//Insert Question
const insertCertificate = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    if (!student_id || !course_id ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const data = await conn.query(
      "INSERT INTO Certificates(student_id, course_id) VALUES ( ?, ? )",
      [student_id, course_id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in inserting Certificates",
      });
    }
    res.status(201).json({
      success: true,
      message: "Certificates inserted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in inserting Certificates",
      error: error,
    });
  }
};
//Update Question
const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM Certificates WHERE id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Certificate ID",
      });
    }
    const { student_id, course_id } = req.body;
    const data = await conn.query(
      "UPDATE Certificates SET student_id = ?, course_id=? WHERE id = ?",
      [student_id, course_id, id]
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in updating Certificate",
      });
    }
    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating Certificate",
      error: error,
    });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await conn.query(
      "SELECT * FROM Certificates WHERE id = ?",
      [id]
    );
    if (!id || checkUser[0].length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Certificate ID",
      });
    }
    const data = await conn.query("DELETE FROM Certificates WHERE id = ?", [
      id,
    ]);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Error in deleting Certificates",
      });
    }
    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
      data: data[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting Certificate",
      error: error,
    });
  }
};
module.exports = {
  getAllCertificates,
  getCertificateById,
  insertCertificate,
  updateCertificate,
  deleteCertificate,
};
