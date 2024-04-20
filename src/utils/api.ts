import axios from "axios";
import config from "./config";
const axiosInstance = axios.create({
    baseURL: config.API_URL,
    timeout: 5000 * 60
})

export default axiosInstance