import "./env.js";

import express from "express";
import { serve, setup } from "swagger-ui-express";
import { createRequire } from "module";
import ProductRouter from "./src/features/product/product.routes.js";
import UserRouter from "./src/features/user/user.routes.js";
import jwtAuth from "./src/middelewares/jwt.middeleware.js";
import CartRouter from "./src/features/cart/cart.router.js";
import loggerMiddleware from "./src/middelewares/logger.middleware.js";
import { ApplicationError } from "./src/error-hendler/application.error.js";
import { connectToServer } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.router.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/like.routes.js";

const require = createRequire(import.meta.url);
const apiDocs = require("./swagger.json");

const server = express();

server.use(express.json());

server.use(loggerMiddleware);

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5500"); // frontend origin allow
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // allowed methods
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // token header allow

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

server.use("/api-docs", serve, setup(apiDocs)); 

server.use("/api/product", jwtAuth, ProductRouter);
server.use("/api/cart", jwtAuth, CartRouter);
server.use("/api/users", UserRouter);
server.use("/api/order", jwtAuth, orderRouter);
server.use("/api/like",jwtAuth,likeRouter)

server.get("/", (req, res) => {
  res.send("Hello Welcome to my new creation.");
});

server.use((err, req, res, next) => {
  // console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  } 
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }
  // For server error
  return res.status(500).send("Something went wrong! Please try again.");
});

server.use((req, res) => {
  res.status(404).send("Page not found!");
});

server.listen(3000, () => {
  console.log("Server is listening on http://localhost:3000");
  // connectToServer()
  connectUsingMongoose();
});