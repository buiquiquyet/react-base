import axios from "@/utils/api";
import { BuildParams } from "@/utils/BuildParams";
import { Page } from "@/utils/Page";
import { UserModal } from "@/app/admin/modal/userModal";
export const AUTH_URL = "/api/user";
export function getListUsers(page: Page) {
  const params = BuildParams.Params(page);
  return axios.get(`${AUTH_URL}${params}`);
}
export function getAllUsers() {
  const page = new Page();
  page.pageSize = 9999;
  page.pageNumber = 1;
  return getListUsers(page);
}
export function getUserById(idUser: any) {
  return axios.get(`${AUTH_URL}/${idUser}`);
}
export function getTenDangNhapUsers(tendangnhap: string) {
  return axios.get(`${AUTH_URL}/tendangnhap/${tendangnhap}`);
}
export function createUsers(user: UserModal) {
  return axios.post(`${AUTH_URL}`, user);
}
export function createManyUsers(users: any[]) {
  return axios.post(`${AUTH_URL}/createMany`, users);
}
export function deleteUser(userId: any) {
  return axios.delete(`${AUTH_URL}/${userId}`);
}
export function updateUser(idUser: any, user: UserModal) {
  return axios.put(`${AUTH_URL}/${idUser}`, user);
}
export function deleteUsers(idUsers: any) {
  return axios.delete(`${AUTH_URL}/deleteByIds`, { data: idUsers });
}
