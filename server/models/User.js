import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const saltRounds = 10;
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  id: {
    type: String,
    maxlength: 20,
    minlength: 5,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
  },
  role: {
    type: Number,
    default: 0,
  },
  following: [
    {
      type: ObjectId,
      default: null,
      ref: "User",
    },
  ],
  follower: [
    {
      type: ObjectId,
      default: null,
      ref: "User",
    },
  ],

  profileImage: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  introduction: {
    type: String,
    default: "",
  },
  tokenExp: {
    type: Number,
  },
  token: {
    type: String,
    default: "",
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567    암호화된 비밀번호 $2b$10$VXIgcY/s8ZY8G.5pwLTiH.Qugh7cxuqAX1djWs298c5LA0qvky8Ea
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  //토큰을 decode 한다.
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

export default User;
