import axios from "axios";

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
    const user = await axios.get("/api/uesrs/login/success");
    return user.data;
  } catch (error) {
    console.log(error);
  }
}

export async function auth() {
  const request = await axios.get("/api/users/auth");

  return request.data;
}
