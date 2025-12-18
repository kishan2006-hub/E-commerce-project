import userModel from "./user.model.js";
import jwt from "jsonwebtoken";
import userRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userrepository = new userRepository();
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password, type } = req.body;
      const hashPassword = await bcrypt.hash(password, 12);
      const user = new userModel(name, email, hashPassword, type);
      const ans = await this.userrepository.signUp(user);
      res.status(201).send(ans);
    } catch (err) {
      // console.log(err);
      next(err)
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      const result = await this.userrepository.signIn(email);
      if (!result) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        const ans = await bcrypt.compare(password, result.password);
        if (ans) {
          const token = jwt.sign(
            {
              userId: result._id,
              email: result.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          return res.send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  async resetPassword(req, res) {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const userID = req.userId
    try {
      await this.userrepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password is updated");
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
}

