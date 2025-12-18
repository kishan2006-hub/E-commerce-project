import mongoose from "mongoose";
import { usreSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-hendler/application.error.js";

const userModel = new mongoose.model("users", usreSchema);

class userRepository {
  async signUp(user) {
    try {
      const newUser = new userModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        throw err;
      } else {
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);
      }
    }
  }

  async signIn(email) {
    try {
      return await userModel.findOne({ email });
    } catch (err) {
      console.log(err);
    }
  }

  async resetPassword(userId, hashedPassword) {
    try {
      let user = await userModel.findById(userId);
      if (user) {
        user.password = hashedPassword;
        user.save();
      } else {
        throw new Error("No such user found");
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default userRepository;

