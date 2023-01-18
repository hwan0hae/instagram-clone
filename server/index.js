import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "./config/key.js";
import cookieParser from "cookie-parser";
import {
  register,
  login,
  loginSuccess,
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
app.get("/api/users/login/success", loginSuccess);
app.get("/api/users/accesstoken", accessToken);
app.get("/api/users/refreshtoken", refreshToken);
app.get("/api/users/logout", logout);

app.listen(port, () => {
  console.log(`http://localhost:${port} 실행`);
});
