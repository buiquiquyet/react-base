import axios from "@/utils/api";

export const AUTH_URL = "/api/auth";

export function login(email: string, password: string) {
  return axios.post(`${AUTH_URL}/login`, {
    email,
    password,
  });
}
export function register(data: { name: any; email: string; password: string }) {
  return axios.post(`${AUTH_URL}/register`, data);
}
export function checkUserName(data: any) {
  return axios.post(`${AUTH_URL}/check-username?userName=${data}`);
}
export function checkEmail(data: any) {
  return axios.post(`${AUTH_URL}/check-email?email=${data}`);
}
