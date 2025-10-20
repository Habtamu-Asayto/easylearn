// Import from the env
const api_url = "http://localhost:8080";

// A function to send post request to create a new User
const createUser = async (formData) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/user`, requestOptions);
  return response;
};
// services/user.service.js
const createStudent = async (formData, loggedInUserToken) => {
  try {
    const response = await fetch(`${api_url}/api/add-student`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-access-token": loggedInUserToken,
      },
      body: JSON.stringify(formData),
    });

    // If not OK, try to parse error or throw
    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Server error: ${response.status} - ${text}`);
      throw new Error(text);
    }

    return response.json();
  } catch (error) {
    console.error("createStudent error:", error);
    throw error;
  }
};

// A function to send get request to get all students
const getAllStudents = async (token) => {
  // console.log(token);
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },    
  };
  const response = await fetch(`${api_url}/api/students`, requestOptions);
  return response;
};

const resendVerification = async () => {
  try {
    const res = await fetch(`${api_url}/api/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user_email }),
    });
    const d = await res.json();
    if (res.ok) {
      alert("Verification email resent. Check your inbox.");
    } else {
      alert(d.error || "Could not resend.");
    }
  } catch (err) {
    alert("Error resending verification: " + err.message);
  }
};

// Export all the functions
const userService = {
  createUser,
  getAllStudents,
  createStudent,
  resendVerification
};
export default userService;
