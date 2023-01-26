import { ObjectId } from "mongoose";
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
  introduction: string;
  role: number;
  __v: number;
  _id: ObjectId;
}

export const userAtom = atom<IUser | null>({
  key: "user",
  default: null,
});

export const onProfileImgClickedAtom = atom<boolean>({
  key: "profileImgClicked",
  default: false,
});

export const onFeedUploadClickedAtom = atom<boolean>({
  key: "feedUploadClicked",
  default: false,
});

export const detailClickedAtom = atom<boolean>({
  key: "detailClicked",
  default: false,
});
