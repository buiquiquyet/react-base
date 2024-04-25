import axios from "@/utils/api";


export const AUTH_URL = "/api/department";
export function getAllDepartments() {
  return axios.get(`${AUTH_URL}`);
}
