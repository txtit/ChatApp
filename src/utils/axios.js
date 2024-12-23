import axios from "axios";

// 
// import { BASE_URL } from "../config";

export const BASE_URL = "http://localhost:3000";


const axiosInstance = axios.create({ baseURL: BASE_URL, withCredentials: true, });

axios.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || "Something went wrong",
        )
);

export default axiosInstance;

