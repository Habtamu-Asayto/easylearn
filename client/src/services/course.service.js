// Import from the env
const api_url = "http://localhost:8080";

// A function to send post request to create a new User
const createCourse = async (formData, loggedInUserToken) => {
  
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/add-course`, requestOptions);
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
};

// A function to send post request to create a new User
const updateCourse = async (id, formData, loggedInUserToken) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(
    `${api_url}/api/add-course/${id}`,
    requestOptions
  );
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
};

const getAllCourses = async (token) => {
  // console.log(token);
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(`${api_url}/api/courses`, requestOptions);
  return response;
};

const deleteCourse = async (id, token) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };

  const response = await fetch(`${api_url}/api/courses/${id}`, requestOptions);

  // Check if response is JSON first
  let data;
  try {
    data = await response.json();
  } catch (err) {
    // If backend didn't return JSON (e.g., 500 error), return a fallback
    console.error("Failed to parse JSON:", err);
    return { status: false, error: "Server returned invalid response" };
  }

  return data;
};

  


const courseService = {
  createCourse,
  getAllCourses,
  updateCourse, 
  deleteCourse
};
export default courseService;
