import express from "express";
import OrderController from "./order.controller.js";
// 2. Initialize Express router.
const orderRouter = express.Router();

const orderController = new OrderController();

orderRouter.post("/", (req, res) => {
  orderController.placeOrder(req, res);
});

export default orderRouter;
