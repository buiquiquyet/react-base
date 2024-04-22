
import axios from "@/utils/api";

export const AUTH_URL = "/api/User";
export function getAllUsers() {
    return axios.get(`${AUTH_URL}`);
  }