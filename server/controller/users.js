import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    console.log(err);
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;
  //요청된 이메일을 DB에서 찾는다.
  //email : email(req.body.email) 와 같음
  User.findOne({ email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    //요청된 이메일이 DB에 있다면 비밀번호가 맞는 비밀번호 인지 확인.

    user.comparePassword(password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      //비밀번호 까지 맞다면 jsonwebtoken을 이용해서 token을 생성하기
      try {
        //access Token 발급
        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.ACCESS_SECRET,
          { expiresIn: "1m", issuer: "Hwan_0_hae" }
        );

        //refresh Token 발급
        const refreshToken = jwt.sign(
          { _id: user._id },
          process.env.REFRESH_SECRET,
          { expiresIn: "24h", issuer: "Hwan_0_hae" }
        );

        //token 전송
        res.cookie("accessToken", accessToken, {
          secure: false,
          httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
          secure: false,
          httpOnly: true,
        });

        res.status(200).json({ loginSuccess: true, userId: user._id });
      } catch (error) {
        res.status(500).json(error);
      }
      // user.generateToken((err, user) => {
      //   if (err) return res.status(400).send(err);

      //   //토큰을 저장한다. 어디에 ? 쿠키,로컬스토리지
      //   res
      //     .cookie("x_auth", user.token)
      //     .status(200)
      //     .json({ loginSuccess: true, userId: user._id });
      // });
    });
  });
};

export const accessToken = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    //토큰을 decode 한다.

    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    User.findOne({ _id: data._id }, (err, user) => {
      if (err) throw err;
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const refreshToken = (req, res) => {
  //용도 : access token을 갱신
  try {
    const token = req.cookies.refreshToken;
    const data = jwt.verify(token, process.env.REFRESH_SECRET);

    User.findOne({ _id: data._id }, (err, user) => {
      if (err) throw err;

      //access token 새로 발급
      const accessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_SECRET,
        { expiresIn: "1m", issuer: "Hwan_0_hae" }
      );

      res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
      });

      res.status(200).json("Access Token Recreated");
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const loginSuccess = (req, res) => {
  try {
    if (req.cookies.accessToken) {
      const token = req.cookies.accessToken;

      const data = jwt.verify(token, process.env.ACCESS_SECRET);

      User.findOne({ _id: data._id }, (err, user) => {
        if (err) throw err;

        const { password, ...others } = user._doc;

        res.status(200).json({ isAuth: true, ...others });
      });
    } else {
      throw {
        name: "NoTokenError",
        message: "There is no accesToken in the cookie.",
      };
    }
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        res.status(200).json({ isAuth: false, message: error.message });
        break;
      case "NoTokenError":
        res.status(200).json({ isAuth: false, message: error.message });
        break;
      default:
        res.status(500).json(error);
    }
    //아마 여기서 만료시 리프레시 토큰 사용해서 갱신
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("accessToken", "");
    res.status(200).json("Logout Success");
  } catch (error) {
    res.status(500).json(error);
  }
};
