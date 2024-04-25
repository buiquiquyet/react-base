import axios from "@/utils/api";

export const AUTH_URL = "/api/class";
export function getAllClasses() {
  return axios.get(`${AUTH_URL}`);
}
export function getClassesByIdKhoa(idKhoa: string) {
  return axios.get(`${AUTH_URL}/department/${idKhoa}`);
}