//Import user service
const userService = require("../services/userService");

//Create User
async function createUser(req, res, next) {
  // check if token arives
  console.log(req.headers);
  // Check if employee email already exists in the database
  const userExists = await userService.checkIfUserExists(req.body.user_email);
  // If employee exists, send a response to the client
  if (userExists) {
    res.status(400).json({
      error: "This email address is already associated with another employee!",
    });
  } else {
    try {
      const userData = req.body;
      // Create the employee
      const user = await userService.createUser(userData);
      if (!user) {
        res.status(400).json({
          error: "Failed to add the User!",
        });
      } else {
        res.status(200).json({
          status: "true",
        });
      }
    } catch (error) {
      console.log(err);
      res.status(400).json({
        error: "Something went wrong!",
      });
    }
  }
}
module.exports = {
  createUser,
};
