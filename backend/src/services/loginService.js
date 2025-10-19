// Import the query function from the db.config.js file
const conn = require("../config/db");
// Import the bcrypt module to do the password comparison
const bcrypt = require("bcrypt");
// Import the user service to get user by email
const userService = require("./userService");
// Handle user login
async function logIn(userData) {
  try {
    let returnData = {}; // Object to be returned
    const user = await userService.getUserByEmail(userData.user_email);
    if (user.length === 0) {
      returnData = {
        status: "fail",
        message: "User does not exist",
      };
      return returnData;
    }
    const passwordMatch = await bcrypt.compare(
      userData.user_password,
      user[0].user_password_hashed
    );
    if (!passwordMatch) {
      returnData = {
        status: "fail",
        message: "Incorrect password",
      };
      return returnData;
    }

    console.log("Checker");

    // Check email verification
    if (!user[0].is_verified) {
      return {
        status: "error",
        message: "Please verify your email before logging in.",
      };
    }

    returnData = {
      status: "success",
      data: user[0],
    };
    return returnData;
  } catch (error) {
    console.log(error);
  }
}

// Export the function
module.exports = {
  logIn,
};
