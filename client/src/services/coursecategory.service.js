// Import from the env
const api_url = "http://localhost:8080";

// A function to send post request to create a new User
const createCategory = async (formData, loggedInUserToken) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/category`, requestOptions);
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
};

// Update category
const updateCategory = async (id, formData, loggedInUserToken) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/category/${id}`, requestOptions);
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
};

const getAllcategory = async (token) => {
  // console.log(token);
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(`${api_url}/api/category`, requestOptions);
  return response;
};

const getCategoryForCourse = async (token) => {
  const requestOption = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(`${api_url}/api/category`, requestOption);
  return response.json();
};

const deleteCategory = async (id, token) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };

  console.log(`${api_url}/api/category/${id}`);
  
  const response = await fetch(`${api_url}/api/category/${id}`, requestOptions);

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

const categoryService = {
  createCategory,
  getAllcategory,
  getCategoryForCourse,
  updateCategory,
  deleteCategory,
};

export default categoryService;
