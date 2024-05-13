import axios from "@/utils/api";

export const AUTH_URL = "/api/subject";

export function getAllSubjects() {
  return axios.get(`${AUTH_URL}`);
}
export function getSubjectById(subjectId: string) {
  return axios.get(`${AUTH_URL}/${subjectId}`);
}
export function getSubjectsByUserTdn(userTdn: string) {
  return axios.get(`${AUTH_URL}/user/${userTdn}`);
}
export function getSubjectsByDepartmentId(departmentId: string) {
  return axios.get(`${AUTH_URL}/department/${departmentId}`);
}