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
const updateCategory = async (formData, loggedInUserToken)=>{
  const requestOptions={
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
      "x-access-token": loggedInUserToken,
    },
    body:JSON.stringify(formData),
  }
  const response = await fetch(`${api_url}/api/category/:id`, requestOptions);
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
}
const deleteCategory = async (id, token) => {
  const response = await fetch(`${api_url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }

  return response.json();
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

const getCategoryForCourse = async(token)=>{
  const requestOption={
    method:"GET",
    headers:{
      "Content-Type":"application/json",
      "x-access-token":token
    }
  }
  const response = await fetch(`${api_url}/api/category`, requestOption);
  return response.json();
}
const categoryService = {
  createCategory,
  getAllcategory,
  getCategoryForCourse,
  updateCategory,
};

export default categoryService;
