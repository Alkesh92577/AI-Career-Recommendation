import axios from "axios";

const api = axios.create({

  baseURL: "http:// 10.72.150.168:8080/api",

  headers: {
    "Content-Type": "application/json"
  }

});

export default api;