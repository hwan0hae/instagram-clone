import axios from "axios";
import { Date, ObjectId } from "mongoose";
import api from "./apiController";

export interface IAllUser {
  _id: ObjectId;
  name: string;
  email: string;
  id: string;
  role: number;
  profileImage: string;
  introduction: string;
}

export async function allUser() {
  const request = await axios.get("/api/users/allUser");

  return request.data;
}
export interface ILoginUser {
  email: string;
  password: string;
}

export async function loginUser(info: ILoginUser) {
  const request = await axios.post("/api/users/login", info);

  return request.data;
}

export interface IRegistrtUser {
  email: string;
  name: string;
  id: string;
  password: string;
}

export async function registerUser(info: IRegistrtUser) {
  const request = await axios.post("/api/users/register", info);

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
  _id: ObjectId;
  writer: ObjectId;
  writerProfile: {
    profileImage: string;
    id: string;
  };
  content: {
    feedImage: string;
    text: string;
  };
  comments: [
    {
      _id: ObjectId;
      writer: ObjectId;
      comment: string;
      createDate: Date;
      writerProfile: {
        profileImage: string;
        id: string;
      };
    }
  ];
  likeList: ObjectId[];
  createDate: Date;
}

export async function getMyFeed() {
  const request = await axios.get("/api/feed/myfeed");

  return request.data;
}

export async function getAllFeed() {
  const request = await axios.get("/api/feed/feed");

  return request.data;
}
export async function getFeed(feedId: string) {
  const request = await axios.get(`/api/feed/${feedId}/detail`);

  return request.data;
}

export interface IComment {
  writer: ObjectId;
  comment: string;
  feedId: ObjectId;
}

export async function commentWrite(comment: IComment) {
  const request = await axios.post(`/api/feed/comment`, comment);
  return request.data;
}

export interface ICommentDelete {
  feedId: ObjectId;
  _id: ObjectId;
}

export async function commentDelete(data: ICommentDelete) {
  const request = await axios.post(`/api/feed/commentdelete`, data);
  return request.data;
}
//뭘로비교하징 feedId 로 피드찾고 게시물의 댓글은 뭘로찾음 ... ?

export interface ILike {
  like: boolean;
  feedId: ObjectId;
}

export async function likeUpdate(likeData: ILike) {
  const request = await axios.post(`/api/feed/like`, likeData);
  return request.data;
}

export interface IGetLikeList {
  likeList: [
    {
      name: string;
      id: string;
      profileImage: string;
    }
  ];
}
export async function getLikeList(feedId: ObjectId) {
  const request = await axios.get(`/api/feed/${feedId}/likelist`);
  return request.data;
}
