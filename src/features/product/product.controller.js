import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      return res.status(400).send("Not found!");
    }
  }

  async addProduct(req, res) {
    try {
      const { name,description, price, sizes, category } = req.body;
      const newProduct = new ProductModel(
        name,
        description,
        parseFloat(price),
        req.file.filename,
        category,
        sizes.split(",")
      );
       console.log("kishan")
      const createdRecord = await this.productRepository.add(newProduct);
      return res.status(200).send(createdRecord);
    } catch (err) {
      return res.status(400).send("Not found!");
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);

      if (!product) {
        return res.status(404).send("Product not found");
      } else {
        return res.status(200).send(product);
      }
    } catch (err) {
      return res.status(400).send("Not found!");
    }
  }

  async filterProduct(req, res) {
    try {
      const { minPrice, maxPrice, category } = req.query;
      const result = await this.productRepository.filter(
        minPrice,
        maxPrice,
        category
      );
      res.status(200).send(result);
    } catch (err) {
      return res.status(401).send(err.message);
    }
  }

  async rateProduct(req, res) {
    try {
      const userID = req.userId;
      const productID = req.body.productID;
      const rating = req.body.rating;

      await this.productRepository.rate(userID, productID, rating);
      return res.status(200).send("Rating has been added");
    } catch (err) {
      return res.status(401).send(err.message);
    }
  }

  async averagePrice(req, res) {
    try {
      const result = await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async averageRatings(req, res) {
    try {
      const result = await this.productRepository.averageRatings();
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async totalRatings(req, res) {
    try {
      const result = await this.productRepository.totalRatingsEachProduct();
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
