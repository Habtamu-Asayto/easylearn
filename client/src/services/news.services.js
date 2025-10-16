// Import from the env
const api_url = "http://localhost:8080";

// A fu
const createNews = async (formData, loggedInUserToken) => {
  
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/news`, requestOptions);
  const data = await response.json(); // parse JSON here
  return data; // return the actual array or object
};
const displayNews=async(loggedInUserToken)=>{

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInUserToken,
    }
  };
  const response = await fetch(`${api_url}/api/news-list`, requestOptions);
  const data = await response.json(); // parse JSON here
 
  return data;
}; 
const newsService = {
  createNews,
  displayNews,
};
export default newsService;
