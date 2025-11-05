import React, { useEffect, useState } from "react";
import feather from "feather-icons";
import userService from "../../../services/user.service";
import { useNavigate, useLocation } from "react-router-dom";
import loginService from "../../../services/login.service";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
// Import the useAuth hook
import { useAuth } from "../../../Contexts/AuthContext.jsx";

function LoginForm(props) {
  const [flipped, setFlipped] = useState(false);
  const [option, setOption] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  useEffect(() => {
    feather.replace(); // replace feather icons after render
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();

  const [user_email, setEmail] = useState("");
  const [user_full_name, setFullName] = useState("");
  const [user_phone, setPhoneNumber] = useState("");
  const [user_password, setPassword] = useState("");
  const [user_role_id, setUser_role_id] = useState(1);

  // Errors
  const [emailError, setEmailError] = useState("");
  const [fullNameRequired, setFullNameRequired] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const flipCard = () => {
    setFlipped(!flipped); // toggle state
  };

  // Create a variable to hold the user's token
  let loggedInUserToken = "";
  // Destructure the auth hook and get the token
  const { user } = useAuth();
  if (user && user.user_token) {
    loggedInUserToken = user.user_token;
  }

  //Register user handeler
  const handleSubmit = (e) => {
    setIsLoading(true);
    // Prevent the default behavior of the form
    e.preventDefault();
    // Handle client side validations
    let valid = true; // Flag
    // Full name is required
    if (!user_full_name) {
      setFullNameRequired("Full name is required");
      valid = false;
    } else {
      setFullNameRequired("");
    }
    // Email is required
    if (!user_email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!user_email.includes("@")) {
      setEmailError("Invalid email format");
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(user_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }

    // Password has to be at least 6 characters long
    if (!user_password || user_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }
    // If the form is not valid, do not submit
    if (!valid) {
      return;
    }

    const formData = {
      user_email: user_email.trim(),
      user_full_name,
      user_phone,
      user_password,
      user_role_id,
    };

    // Pass the form data to the service
    const newuser = userService.createUser(formData);

    newuser
      .then((response) => response.json())
      .then((data) => {
        // If Error is returned from the API server, set the error message
        if (data.error) {
          setServerError(data.error);
        } else {
          // Handle successful response
          setSuccess(true);
          setServerError("");
          toast.success(
            `Registration successfull, please verify on you email ${user_email}`
          );
          setEmail("");
          setFullName("");
          setPassword("");
          setPhoneNumber("");
          // setTimeout(() => {
          //   // window.location.href = '/admin/users';
          //   window.location.href = "/";
          // }, 100);
        }
      })
      // Handle Catch
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setServerError(resMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //Login handler
  const handleLogin = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    // Handle client side validations here
    let valid = true; // Flag
    // Email validation
    if (!user_email) {
      setEmailError("Please enter your email address first");
      valid = false;
    } else if (!user_email.includes("@")) {
      setEmailError("Invalid email format");
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(user_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }
    // Password has to be at least 6 characters long
    if (!user_password || user_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) {
      return;
    }
    // Handle form submission here
    const formData = {
      user_email,
      user_password,
    };

    const loginUser = loginService.logIn(formData);
    loginUser
      .then((response) => response.json())
      .then((response) => {
        if (response.status === "success") {
          // Save the user in the local storage

          if (response.data.user_token) {
            localStorage.setItem("user", JSON.stringify(response.data));
          }
          if (location.pathname === "/login") {
            window.location.replace("/");
          } else {
            window.location.reload();
          }
        } else {
          // Show an error message
          toast.error(response.message);
        }
      })
      .catch((err) => {
        setServerError("An error has occurred. Please try again later." + err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleForgot = async (event) => {
    event.preventDefault();
    if (!forgotEmail) return;

    try {
      await userService.forgotPassword(forgotEmail);
      toast.success(`Reset link sent to ${forgotEmail}`);
      setShowPasswordModal(false);
      setForgotEmail("");
    } catch (err) {
      toast.error("Failed to send reset link. Try again.");
    }
  };

  return (
    <div>
      <div
        className={`form-card relative w-full h-full ${
          flipped ? "flipped" : ""
        }`}
      >
        {/* Login Form */}
        <div className="form-front max-w-3xl mx-auto px-6">
          <div className="text-center mb-3">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-feather="book-open" className="text-indigo-500 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
              Welcome Back
            </h1>
            <p className="text-gray-600 animate-fade-in delay-100">
              Login to continue your learning journey
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 animate-fade-in-up">
            <div className="space-y-4">
              {/* Email */}
              <div className="w-full">
                {serverError && (
                  <div className="text-red-600 text-sm mb-2" role="alert">
                    {serverError}
                  </div>
                )}
                <input
                  type="email"
                  name="user_email"
                  value={user_email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                {emailError && (
                  <div className="text-red-600 text-sm mt-1" role="alert">
                    {emailError}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="w-full">
                <input
                  type="password"
                  name="user_password"
                  value={user_password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                {passwordError && (
                  <div className="text-red-600 text-sm mt-1" role="alert">
                    {passwordError}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="text-indigo-600" /> Remember
                  me
                </label>
                <a
                  href="#"
                  onClick={() => setShowPasswordModal(true)}
                  className="text-indigo-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login */}
              <div className="w-full">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200 cursor-pointer"
                >
                  {isLoading ? "Logging..." : "Login"}
                </button>
              </div>

              <div className="relative animate-fade-in delay-400">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 animate-fade-in delay-400">
                <button
                  type="button"
                  className="social-btn flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <i data-feather="github" className="w-5 h-5 mr-2" />
                  <span>GitHub</span>
                </button>
                <button
                  type="button"
                  className="social-btn flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <i data-feather="google" className="w-5 h-5 mr-2" />
                  <span>Google</span>
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?
            <button
              onClick={flipCard}
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        </div>
        {/* Registration Form */}
        <div className="form-back absolute inset-0 p-8 bg-white overflow-x-scroll scrollbar-hide">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-feather="user-plus" className="text-indigo-500 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Join our learning community</p>
          </div>
          {/* {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-semibold">Registration successful</h3>
                <p>
                  We sent a verification email to <strong>{user_email}</strong>.
                  Please click the link in that email to activate your account.
                </p>
                <p>
                  If you don't see it, check spam or{" "}
                  {/* <button onClick={resendVerification}>resend</button>.</p>  </div> */}
          {/* )} */}

          <form
            className="space-y-3 animate-fade-in-up"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              {/* Email */}
              <div className="w-full">
                {serverError && (
                  <div className="text-red-600 text-sm mb-2" role="alert">
                    {serverError}
                  </div>
                )}
                <input
                  type="email"
                  name="user_email"
                  value={user_email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                {emailError && (
                  <div className="text-red-600 text-sm mt-1" role="alert">
                    {emailError}
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div className="w-full">
                <input
                  type="text"
                  name="user_full_name"
                  value={user_full_name}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                {fullNameRequired && (
                  <div className="text-red-600 text-sm mt-1" role="alert">
                    {fullNameRequired}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="w-full">
                <input
                  type="text"
                  name="user_phone"
                  value={user_phone}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone (+2519-555-5555)"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Role */}
              <div className="w-full mb-4">
                <select
                  id="user_role"
                  name="user_role"
                  value={user_role_id}
                  onChange={(event) => setUser_role_id(event.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="1">Admin</option>
                  <option value="2">Instructor</option>
                  <option value="3">Student</option>
                </select>
              </div>

              {/* Password */}
              <div className="w-full">
                <input
                  type="password"
                  name="user_password"
                  value={user_password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                {passwordError && (
                  <div className="text-red-600 text-sm mt-1" role="alert">
                    {passwordError}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 cursor-pointer"
                >
                  {isLoading ? "Registering..." : "Add User"}
                </button>
              </div>
            </div>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?
            <button
              onClick={flipCard}
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>

      {/* Forgot password */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal Card */}
            <motion.div
              className="
                                bg-white rounded-2xl shadow-xl p-6 sm:p-8 
                                w-full max-w-md sm:max-w-lg md:max-w-xl relative
                                overflow-y-auto  
                              "
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                Change Password
              </h2>

              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                >
                  Update Password
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LoginForm;
