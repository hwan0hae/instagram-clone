import Feed from "../models/Feed.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const upload = (req, res) => {
  try {
    const { path } = req.file;
    const token = req.cookies.accessToken;
    const { _id } = jwt.verify(token, process.env.ACCESS_SECRET);
    const url = `http://localhost:${process.env.PORT}/${path}`;
    User.findOne({ _id }, (err, user) => {
      if (err) throw err;

      const id = user.id;
      const profileImage = user.profileImage;

      const feedData = {
        writer: { writer: _id, profileImage, id },
        content: { feedImage: url, text: req.body.content },
      };
      const feed = new Feed(feedData);

      feed.save((err, data) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getMyFeed = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const { _id } = jwt.verify(token, process.env.ACCESS_SECRET);

    Feed.find({ "writer.writer": _id }, (err, feed) => {
      if (err) throw err;

      res.status(200).json(feed);
    }).sort({ createDate: -1 }); //desc
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
export const getFeed = (req, res) => {
  try {
    Feed.find((err, feed) => {
      if (err) throw err;

      res.status(200).json(feed);
    }).sort({ createDate: -1 }); //desc
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
