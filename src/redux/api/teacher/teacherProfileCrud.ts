import { TeacherModal } from "@/app/teacher/modal/teacherModal";
import { BuildParams } from "@/utils/BuildParams";
import { Page } from "@/utils/Page";
import axios from "@/utils/api";

export const AUTH_URL = "/api/record";

export function getListRecords(page: Page) {
    const params = BuildParams.Params(page);
    return axios.get(`${AUTH_URL}${params}`);
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
export function deleteRecord(recordId: any) {
  return axios.delete(`${AUTH_URL}/${recordId}`);
}
export function updateRecord(idRecord: any, record: TeacherModal) {
  return axios.put(`${AUTH_URL}/${idRecord}`, record);
}
export function deleteRecords(idRecords: any) {
  return axios.delete(`${AUTH_URL}/deleteByIds`, { data: idRecords });
}