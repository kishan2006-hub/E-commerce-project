import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middelewares/fileupload.middeleware.js";

const ProductRouter = express.Router();

const productController = new ProductController();

ProductRouter.post("/rate", (req, res) => {
  productController.rateProduct(req, res);
});
ProductRouter.get("/filter", (req, res) => {
  productController.filterProduct(req, res);
});
ProductRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
ProductRouter.post("/", upload.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});

ProductRouter.get("/averagePrice", (req, res)=>{
  productController.averagePrice(req, res)
});

ProductRouter.get("/averageRatings", (req, res)=>{
  productController.averageRatings(req, res)
});

ProductRouter.get("/totalRatings", (req, res)=>{
  productController.totalRatings(req, res)
});

ProductRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});

export default ProductRouter;
