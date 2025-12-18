import { LikeRepository } from "./like.repository.js";

export class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async getLikes(req, res, next) {
    try {
      const { id, type } = req.query;
      const likes = await this.likeRepository.getLikes(type, id);
      return res.status(200).send(likes);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async likeItem(req, res) {
    try {
      const { id, type } = req.body;
      if (type != "products" && type != "categorys") {
        return res.status(400).send("Invalid");
      }
      if (type == "products") {
        await this.likeRepository.likeProduct(req.userId, id);
      } else {
        await this.likeRepository.likeCategory(req.UserId, id);
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
    res.status(201).send();
  }
}

