import { TeacherModal } from "@/app/teacher/modal/teacherModal";
import { BuildParams } from "@/utils/BuildParams";
import { Page } from "@/utils/Page";
import axios from "@/utils/api";

export const AUTH_URL = "/api/record";

export function getListRecords(page: Page) {
  const params = BuildParams.Params(page);
  return axios.get(`${AUTH_URL}${params}`);
}
export function getListRecordByUserId(idUser: string, page: Page) {
  const params = BuildParams.Params(page);
  return axios.get(`${AUTH_URL}/user/${idUser}${params}`);
}
export function getListRecordByDepartmentAndSubjectId(idDepartment: string,idSubject: string, page: Page) {
  const params = BuildParams.Params(page);
  return axios.get(`${AUTH_URL}/tbt/${idDepartment}/${idSubject}${params}`);
}
export function getAllRecords() {
  return axios.get(`${AUTH_URL}`);
}
export function getRecordById(idRecord: any) {
  return axios.get(`${AUTH_URL}/${idRecord}`);
}
export function createRecord(record: TeacherModal) {
  return axios.post(`${AUTH_URL}`, record);
}
export function deleteRecord(idRecord: any) {
  return axios.delete(`${AUTH_URL}/${idRecord}`);
}
export function updateRecord(idRecord: any, record: TeacherModal) {
  return axios.put(`${AUTH_URL}/${idRecord}`, record);
}
export function updateNoteRecord(idRecord: string, note: string) {
  return axios.put(`${AUTH_URL}/note/${idRecord}`, note, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export function updateCheckRecords(idRecords: any, valueCheck: string) {
  return axios.put(
    `${AUTH_URL}/updateChecks?updateChecks=${valueCheck}`,
    idRecords,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
export function deleteRecords(idRecords: any) {
  return axios.delete(`${AUTH_URL}/deleteByIds`, { data: idRecords });
}
