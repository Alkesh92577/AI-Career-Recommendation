import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-career-backend-vj8d.onrender.com/api",

  headers: {
    "Content-Type": "application/json"
  }
});

export default api;