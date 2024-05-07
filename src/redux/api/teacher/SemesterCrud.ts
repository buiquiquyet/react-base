import axios from "@/utils/api";

export const AUTH_URL = "/api/semester";

export function getAllSemesters() {
  return axios.get(`${AUTH_URL}`);
}
export function getSemesterById(semesterId: string) {
  return axios.get(`${AUTH_URL}/${semesterId}`);
}
