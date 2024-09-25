import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  headers: {
    Authorization: import.meta.env.VITE_PUBLIC_AUTHORIZATION,
  },
});

export default api;
