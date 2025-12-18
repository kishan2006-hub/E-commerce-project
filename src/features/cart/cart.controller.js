import CartModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";
import { ApplicationError } from "../../error-hendler/application.error.js";

export default class CartController {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  async add(req, res) {
    try {
      const { productID, quantity } = req.body;
      const userID = req.userId;
      await this.cartRepository.add(productID, userID, quantity);
      res.status(201).send("Cart added successfully.");
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async get(req, res) {
    try {
      const items = await this.cartRepository.get(req.userId);
      return res.status(200).send(items);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

  async delete(req, res) {
    const cartId = req.params.id;
    const err = await this.cartRepository.delete(req.userId, cartId);
    if (!err) {
      res.status(404).send("cart not found");
    } else {
      res.status(200).send("Removed successfully.");
    }
  }
  
}
