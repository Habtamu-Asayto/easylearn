// Import from the env
const api_url = "http://localhost:8080";

// A function to send post request to create a new User
const createUser = async (formData, loggedInUserToken) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/user`, requestOptions);
  return response;
};
// Export all the functions
const userService = {
  createUser,
};
export default userService;
