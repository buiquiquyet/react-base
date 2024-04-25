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
  const page = new Page()
  page.pageSize = 9999;
  page.pageNumber = 1;
  return getListUsers(page);
}
export function getTenDangNhapUsers(tendangnhap: string) {
  return axios.get(`${AUTH_URL}/tendangnhap/${tendangnhap}`);
}
export function createUsers(user: UserModal) {
  return axios.post(`${AUTH_URL}`, user);
}
