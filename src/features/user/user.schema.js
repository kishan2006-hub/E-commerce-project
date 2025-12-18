import mongoose from "mongoose";

export const usreSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+\@.+\../, "Please enter a valid email"],
  },
  password: {
   type:String,
   required:true,
  },
  type: { type: String, enum: ["buyer", "seller"] },
});

