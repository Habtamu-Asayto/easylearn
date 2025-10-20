import axios from "axios";

const API_URL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:8080/api";
export const fetchContacts = () => axios.get(`${API_URL}/contacts`);
export const fetchMessages = (contactId) =>
  axios.get(`${API_URL}/messages/${contactId}`);
 
export const sendMessage = async (contactId, message) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Extract the token
  const token = user?.user_token;
  console.log("Sending token:", token);
  // Debug check
  if (!token) {
    console.error("No token found in localStorage");
    throw new Error("Missing user token");
  }
  // Send message with Authorization header
  return axios.post(
    `${API_URL}/messages`,
    { to: contactId, message },
    {
      headers: { 
        "x-access-token": token,
      },
    }
  );
};
