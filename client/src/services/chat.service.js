import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

//   get token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.user_token;
};
export const fetchContacts = () => axios.get(`${API_URL}/contacts`);

export const fetchMessages = (contactId) =>
  axios.get(`${API_URL}/messages/${contactId}`, {
    headers: { "x-access-token": getToken() },
  });
 
  export const getUnreadMessage = (userId) =>
    axios.get(`${API_URL}/unread-count/${userId}`, {
      headers: { "x-access-token": getToken() },
    });

export const sendMessage = (contactId, message) => {
  const token = getToken();
  console.log("Token being sent:", token);

  return axios.post(
    `${API_URL}/messages`,
    { to: contactId, message },
    { headers: { "x-access-token": token } }
  );
};
