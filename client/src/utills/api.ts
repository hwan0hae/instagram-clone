import axios from "axios";
import api from "./apiController";

export interface ILoginUser {
  email: string;
  password: string;
}

export async function loginUser(info: ILoginUser) {
  const request = await axios.post("api/users/login", info);

  return request.data;
}

export interface IRegistrtUser {
  email: string;
  name: string;
  id: string;
  password: string;
}

export async function registerUser(info: IRegistrtUser) {
  const request = await axios.post("api/users/register", info);

  return request.data;
}

export async function loginSuccess() {
  try {
    const request = await api.get("/api/users/login/success");
    return request.data;
  } catch (error) {
    console.log(error);
  }
}

export async function auth() {
  const request = await axios.get("/api/users/auth");

  return request.data;
}

export async function logout() {
  const request = await axios.get("/api/users/logout");

  return request.data;
}

export interface IModify {
  name: string;
  id: string;
  introduction: string;
}
export async function modify(info: IModify) {
  const request = await axios.post("/api/users/profilemodification", info);
  return request.data;
}
