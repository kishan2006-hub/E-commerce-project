import { getDB } from "../../config/mongodb.js";

class userRepository {
  async signUp(user) {
    try {
      const db = getDB();
      const collection = db.collection("users");
      await collection.insertOne(user);
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async signIn(email) {
    try {
      const db = getDB();
      const collection = db.collection("users");
      return await collection.findOne({email})
    } catch (err) {
      console.log(err);
    }
  }
}

export default userRepository

