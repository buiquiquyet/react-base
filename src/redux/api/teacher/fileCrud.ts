import axios from "@/utils/api";

export const AUTH_URL = "/api/file";

export function createFiles(files: any) {
  return axios.post(`${AUTH_URL}`, files,{
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
export function getCountByRecordId(recordId: string) {
  return axios.get(`${AUTH_URL}/record/${recordId}`);
}
export function deleteFiles(idFiles: any) {
  return axios.delete(`${AUTH_URL}/deleteByIds`, { data: idFiles });
}
export function deleteFileByProfileIds(idProfiles: any) {
  return axios.delete(`${AUTH_URL}/profile/deleteByIds`, { data: idProfiles });
}