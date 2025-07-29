import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/auth", // 👈 ya no tienes que repetir esto más
});

export default instance;
