const express = require("express");
const {
  getAllCertificates,
  getCertificateById,
  insertCertificate,
  updateCertificate,
  deleteCertificate,
} = require("../controllers/certificateController");
const router = express.Router();

//Get all Categoriesa
router.get("/getall", getAllCertificates);

//Get course category by ID
router.get("/get/:id", getCertificateById);

//Insert new course category
router.post("/insert", insertCertificate);

//Insert new course category
router.put("/update/:id", updateCertificate);

//Delete course category
router.delete("/delete/:id", deleteCertificate);

module.exports = router;
