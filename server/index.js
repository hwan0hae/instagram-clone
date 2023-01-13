import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import config from "./config/key.js";
import cookieParser from "cookie-parser";
import auth from "./middleware/auth.js";
import {
  register,
  login,
  loginSucess,
  accessToken,
  refreshToken,
  logout,
} from "./controller/users.js";

const app = express();
dotenv.config();
const port = process.env.PORT;
//application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//application/json
app.use(express.json());

app.use(cookieParser());

mongoose.set("strictQuery", true);
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("몽고 연결..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/api/users/register", register);
app.post("/api/users/login", login);
app.get("/api/uesrs/login/success", loginSucess);
app.get("/api/users/accesstoken", accessToken);
app.get("/api/users/refreshtoken", refreshToken);
app.get("/api/users/logout", logout);

//role 0 => 일반유저, role 0이 아니면 관리자
app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    id: req.user.id,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// app.get("/api/users/logout", auth, (req, res) => {
//   User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
//     if (err) return res.json({ sucess: false, err });
//     return res.status(200).send({ sucess: true });
//   });
// });

app.listen(port, () => {
  console.log(`http://localhost:${port} 실행`);
});
