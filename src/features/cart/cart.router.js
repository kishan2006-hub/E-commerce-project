import express from "express"
import CartController from "./cart.controller.js";

const CartRouter = express.Router()

const cartController = new CartController

CartRouter.post("/",(req, res) => {
    cartController.add(req, res)
})
CartRouter.get("/",(req, res) => {
    cartController.get(req, res)
})
CartRouter.delete("/delete/:id",(req, res) => {
    cartController.delete(req, res)
})
CartRouter.get("/all",(req, res) => {
    cartController.getAllCarts(req, res)
})

export default CartRouter
