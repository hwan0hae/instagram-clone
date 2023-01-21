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
  accessToken,
  refreshToken,
  logout,
  profileUpload,
  profileDelete,
  profileModification,
} from "./controller/users.js";

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

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/api/users/register", register);
app.post("/api/users/login", login);
app.get("/api/users/login/success", loginSuccess);
app.get("/api/users/accesstoken", accessToken);
app.get("/api/users/refreshtoken", refreshToken);
app.get("/api/users/logout", logout);

const storage = multer.diskStorage({
  //목적지
  destination: function (req, file, cb) {
    cb(null, "server/uploads/profileImg");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});
//upload middleware 함수  -single 한개의 파일
const upload = multer({ storage: storage }).single("file");

app.post("/api/users/profileupload", upload, profileUpload);
app.get("/api/users/profiledelete", profileDelete);
app.post("/api/users/profilemodification", profileModification);
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`http://localhost:${port} 실행`);
});
