import { TeacherModal } from "@/app/teacher/modal/teacherModal";
import { BuildParams } from "@/utils/BuildParams";
import { Page } from "@/utils/Page";
import axios from "@/utils/api";

export const AUTH_URL = "/api/instructor";

export function getListInstructors(page: Page) {
  const params = BuildParams.Params(page);
  return axios.get(`${AUTH_URL}${params}`);
}
export function getListInstructorByUserId(idUser: string, page: Page) {
  const params = BuildParams.Params(page);
  return axios.get(`${AUTH_URL}/user/${idUser}${params}`);
}
export function getAllInstructors() {
  return axios.get(`${AUTH_URL}`);
}
export function getInstructorById(idInstructor: any) {
  return axios.get(`${AUTH_URL}/${idInstructor}`);
}
export function createInstructor(Instructor: TeacherModal) {
  return axios.post(`${AUTH_URL}`, Instructor);
}
export function deleteInstructor(idInstructor: any) {
  return axios.delete(`${AUTH_URL}/${idInstructor}`);
}
export function updateInstructor(idInstructor: any, Instructor: TeacherModal) {
  return axios.put(`${AUTH_URL}/${idInstructor}`, Instructor);
}
export function deleteInstructors(idInstructors: any) {
  return axios.delete(`${AUTH_URL}/deleteByIds`, { data: idInstructors });
}
