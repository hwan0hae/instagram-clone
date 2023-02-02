import Feed from "../models/Feed.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const feedUpload = (req, res) => {
  try {
    const { path } = req.file;
    const token = req.cookies.accessToken;
    const { _id } = jwt.verify(token, process.env.ACCESS_SECRET);
    const url = `http://localhost:${process.env.PORT}/${path}`;

    const feedData = {
      writer: _id,
      content: { feedImage: url, text: req.body.content },
    };
    const feed = new Feed(feedData);

    feed.save((err, data) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
export const commentWrite = (req, res) => {
  try {
    const { feedId, ...comment } = req.body;

    Feed.findOneAndUpdate(
      { _id: feedId },
      { $push: { comments: comment } },
      (err, feed) => {
        if (err) throw err;

        res.status(200).json({ success: true });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
export const commentDelete = (req, res) => {
  try {
    const { feedId, _id } = req.body;

    Feed.findOneAndUpdate(
      { _id: feedId },
      { $pull: { comments: { _id } } },
      (err, feed) => {
        if (err) throw err;
        res.status(200).json({ success: true });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getMyFeed = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const { _id } = jwt.verify(token, process.env.ACCESS_SECRET);

    Feed.find({ writer: _id }, (err, feed) => {
      if (err) throw err;

      res.status(200).json(feed);
    }).sort({ createDate: -1 }); //desc
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getAllFeed = (req, res) => {
  try {
    Feed.find(async (err, feed) => {
      if (err) throw err;

      const allFeed = await Promise.all(
        feed.map(async (feed) => {
          //피드 작성자 _id 조회해서 작성자 데이터 id + 사진가져와야함
          const profileData = await User.findOne(
            { _id: feed.writer },
            { profileImage: 1, id: 1, _id: 0 }
          );

          const comments = await Promise.all(
            feed.comments.map(async (comment) => {
              const commentWriterProfile = await User.findOne(
                { _id: comment.writer },
                { profileImage: 1, id: 1, _id: 0 }
              );

              const commentWriter = {
                ...comment._doc,
                writerProfile: commentWriterProfile,
              };

              return commentWriter;
            })
          );
          const feedData = {
            ...feed._doc,
            comments,
            writerProfile: profileData,
          };

          return feedData;
        })
      );
      res.status(200).json(allFeed);
    }).sort({ createDate: -1 }); //desc
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getFeed = (req, res) => {
  try {
    const { feedId } = req.params;
    Feed.find({ _id: feedId }, async (err, feed) => {
      if (err) throw err;

      const profileData = await User.findOne(
        { _id: feed[0].writer },
        { profileImage: 1, id: 1, _id: 0 }
      );

      const comments = await Promise.all(
        feed[0].comments.map(async (comment) => {
          const commentWriterProfile = await User.findOne(
            { _id: comment.writer },
            { profileImage: 1, id: 1, _id: 0 }
          );

          const commentWriter = {
            ...comment._doc,
            writerProfile: commentWriterProfile,
          };

          return commentWriter;
        })
      );

      const feedData = {
        ...feed[0]._doc,
        comments,
        writerProfile: profileData,
      };

      res.status(200).json(feedData);
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const like = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    const { _id } = jwt.verify(token, process.env.ACCESS_SECRET);

    const { like, feedId } = req.body;
    if (like) {
      Feed.findOneAndUpdate(
        { _id: feedId },
        { $push: { likeList: _id } },
        (err, feed) => {
          if (err) throw err;

          res
            .status(200)
            .json({ success: true, message: "좋아요를 눌렀습니다." });
        }
      );
    } else {
      Feed.findOneAndUpdate(
        { _id: feedId },
        { $pull: { likeList: _id } },
        (err, feed) => {
          if (err) throw err;

          res
            .status(200)
            .json({ success: true, message: "좋아요를 취소하였습니다." });
        }
      );
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getLikeList = (req, res) => {
  try {
    const { feedId } = req.params;
    Feed.findOne({ _id: feedId }, async (err, feed) => {
      if (err) throw err;
      const likeList = await Promise.all(
        feed.likeList.map(async (_id) => {
          const listProfile = await User.find(
            { _id },
            { profileImage: 1, id: 1, name: 1, _id: 0 }
          );
          return listProfile[0];
        })
      );
      res.status(200).json({ success: true, likeList });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
