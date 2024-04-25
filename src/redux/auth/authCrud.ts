import axios from "@/utils/api";

export const AUTH_URL = "/api/auth";

export function login(tendangnhap: string, matkhau: string) {
  return axios.post(`${AUTH_URL}/login`, {
    tendangnhap,
    matkhau,
  });
}

// export function register(data: { name: any; email: string; password: string }) {
//   return axios.post(`${AUTH_URL}/register`, data);
// }
// export function checkUserName(data: any) {
//   return axios.post(`${AUTH_URL}/check-username?userName=${data}`);
// }
// export function checkEmail(data: any) {
//   return axios.post(`${AUTH_URL}/check-email?email=${data}`);
// }
