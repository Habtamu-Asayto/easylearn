// Import the login service
const loginService = require("../services/loginService");
// Import the jsonwebtoken module
const jwt = require("jsonwebtoken");
// Import the secret key from the environment variables
const jwtSecret = process.env.JWT_SECRET;

// Handle user login
async function logIn(req, res, next) { 
 
  try {
    const userData = req.body;
    // Call the logIn method from the login service
    const user = await loginService.logIn(userData);

    // If the user is not found
    if (user.status === "fail" || user.status === "error") {
      return res.status(403).json({
        status: user.status,
        message: user.message,
      });
    }
    // If successful, send a response to the client
    const payload = {
      user_id: user.data.user_id,
      user_email: user.data.user_email,
      role_name: user.data.role_name,
      user_full_name: user.data.user_full_name,
      profile_img: user.data.profile_img,
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "24h",
    });
    // console.log(token);
    const sendBack = {
      user_token: token,
    };
    res.status(200).json({
      status: "success",
      message: "user logged in successfully",
      data: sendBack,
    });
  } catch (error) {
    console.error("logIn controller error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
}

// Export the functions
module.exports = {
  logIn,
};
