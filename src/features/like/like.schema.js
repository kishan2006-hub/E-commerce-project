import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "on_model",
  },
  on_model: {
    type: String,
    enum: ["products", "categorys"],
  },
})
  .pre("save", function (next) {
    console.log("Like not added.");
    next()
  })
  .post("save", function (doc) {
    console.log("Like added successfully." + doc);
  });
