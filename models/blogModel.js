const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: "users",
      required: true,
    },
    email:{
      type:String
    },
    comment: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const BlogSchema = new Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    comments:[CommentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("blogs", BlogSchema);
