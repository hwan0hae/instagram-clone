import mongoose from "mongoose";

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const FeedSchema = mongoose.Schema({
  writer: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  content: {
    feedImage: { type: String, required: true },
    text: { type: String },
  },
  comments: [
    {
      writer: {
        type: ObjectId,
        required: true,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
      createDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likeList: [
    {
      type: ObjectId,
      default: null,
    },
  ],
  createDate: {
    type: Date,
    default: Date.now,
  },
});

const Feed = mongoose.model("Feed", FeedSchema);

export default Feed;

//feed에 uid만 가지고 id랑 이미지 가져오는것?
