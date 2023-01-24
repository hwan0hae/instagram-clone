import axios from "axios";
import { Date, ObjectId } from "mongoose";
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

export interface IGetFeed {
  content: {
    feedImage: string;
    text: string;
  };
  writer: {
    writer: ObjectId;
    profileImage: string;
    id: string;
  };
  createDate: Date;
}

export async function getMyFeed() {
  const request = await axios.get("/api/feed/myfeed");

  return request.data;
}

export async function getFeed() {
  const request = await axios.get("/api/feed/feed");

  return request.data;
}
