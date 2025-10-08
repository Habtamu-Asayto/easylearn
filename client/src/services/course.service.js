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

const courseService = {
  createCourse,
  getAllCourses,
};
export default courseService;
