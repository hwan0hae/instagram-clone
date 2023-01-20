import { atom } from "recoil";

export const isDarkAtom = atom<boolean>({
  key: "isDark",
  default: true,
});

export const isLoginAtom = atom<boolean>({
  key: "isLogin",
  default: false,
});

export interface IUser {
  email: string;
  id: string;
  name: string;
  profileImage: string;
  role: number;
  __v: number;
  _id: string;
}

export const userAtom = atom<IUser | null>({
  key: "user",
  default: null,
});
