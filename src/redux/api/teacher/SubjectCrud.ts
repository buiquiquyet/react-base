import axios from "@/utils/api";

export const AUTH_URL = "/api/subject";

export function getAllSubjects() {
  return axios.get(`${AUTH_URL}`);
}
export function getSubjectById(subjectId: string) {
  return axios.get(`${AUTH_URL}/${subjectId}`);
}
export function getSubjectsByUserId(userId: string) {
  return axios.get(`${AUTH_URL}/user/${userId}`);
}
export function getSubjectsByDepartmentId(departmentId: string) {
  return axios.get(`${AUTH_URL}/department/${departmentId}`);
}