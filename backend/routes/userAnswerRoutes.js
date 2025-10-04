const express = require("express");
const router = express.Router();
const { 
    getAllAnswers, 
    getAnswersById, 
    insertAnswers,
    updateAnswers,
    deleteAnswers
} = require("../controllers/userAnswerController");
 
//Get all userss
router.get("/getall", getAllAnswers);

//Get user by ID
router.get("/get/:id", getAnswersById);
 
//Insert new User
router.post("/insert", insertAnswers);

//Insert new User
router.put("/update/:id", updateAnswers);

//Delete User
router.delete("/delete/:id", deleteAnswers);



module.exports = router;
