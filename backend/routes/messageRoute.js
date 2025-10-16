// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();

router.get("/send", (req, res) => {
  res.send("Send message");
});

module.exports = router;
