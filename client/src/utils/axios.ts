import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api", // change to your backend URL
  withCredentials: true,
  
});

export default api;