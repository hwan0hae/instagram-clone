import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "./config/key.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import {
  register,
  login,
  loginSuccess,
  refreshToken,
  logout,
  profileUpload,
  profileDelete,
  profileModification,
  allUser,
} from "./controller/users.js";
import {
  getAllFeed,
  getMyFeed,
  feedUpload,
  commentWrite,
  getFeed,
  like,
  getLikeList,
  commentDelete,
} from "./controller/feed.js";

const app = express();
dotenv.config();

//application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//application/json
app.use(express.json());
app.use(cookieParser());

app.use("/server/uploads", express.static("server/uploads"));

mongoose.set("strictQuery", true);
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connect..."))
  .catch((err) => console.log(err));

const profileStorage = multer.diskStorage({
  //목적지
  destination: function (req, file, cb) {
    cb(null, "server/uploads/profileImg");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});
//upload middleware 함수  -single 한개의 파일
const profileUploadMiddleware = multer({ storage: profileStorage }).single(
  "file"
);

const feedStorage = multer.diskStorage({
  //목적지
  destination: function (req, file, cb) {
    //폴더 없으면 생성
    cb(null, "server/uploads/feedImg");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});
//upload middleware 함수  -single 한개의 파일
const feedUploadMiddleware = multer({ storage: feedStorage }).single("file");

/** 회원정보  */
app.post("/api/users/register", register);
app.post("/api/users/login", login);
app.get("/api/users/login/success", loginSuccess);
app.get("/api/users/refreshtoken", refreshToken);
app.get("/api/users/logout", logout);

app.get("/api/users/allUser", allUser);

/** 프로필  */
app.post("/api/users/profileupload", profileUploadMiddleware, profileUpload);
app.get("/api/users/profiledelete", profileDelete);
app.post("/api/users/profilemodification", profileModification);

/** 피드  */
app.get("/api/feed/myfeed", getMyFeed);
app.get("/api/feed/feed", getAllFeed);
app.get("/api/feed/:feedId/detail", getFeed);
app.get("/api/feed/:feedId/likelist", getLikeList);

app.post("/api/feed/upload", feedUploadMiddleware, feedUpload);
app.post("/api/feed/comment", commentWrite);
app.post("/api/feed/commentdelete", commentDelete);
app.post("/api/feed/like", like);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`http://localhost:${port} 실행`);
});
