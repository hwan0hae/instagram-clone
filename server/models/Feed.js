import mongoose from "mongoose";

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const FeedSchema = mongoose.Schema({
  writer: {
    writer: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    profileImage: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      maxlength: 20,
      minlength: 5,
      required: true,
    },
  },
  content: {
    feedImage: { type: String, required: true },
    text: { type: String },
  },

  createDate: {
    type: Date,
    default: Date.now,
  },
});

const Feed = mongoose.model("Feed", FeedSchema);

export default Feed;
