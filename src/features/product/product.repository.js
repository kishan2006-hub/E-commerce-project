import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-hendler/application.error.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = new mongoose.model("products", productSchema);
const reviewModel = new mongoose.model("review", reviewSchema);
const CategoryModel = new mongoose.model("categorys",categorySchema)

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(productData) {
    try {
       productData.categorys = productData.category.split(",").map(e=>e.trim())
       const newProduct = new ProductModel(productData)
       const savedProduct = await newProduct.save()
      
       await CategoryModel.updateMany(
        {_id:{$in:productData.categorys}},
        {$push:{products:new ObjectId(savedProduct._id)}}
       )
    } catch (err) {
      throw new ApplicationError("Something went wrong with Database!", 200);
    }
  }

  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const products = await collection.find().toArray();
      return products;
    } catch (err) {
      throw new ApplicationError("Something went wrong with Database!", 200);
    }
  }

  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const product = await collection.findOne({ _id: new ObjectId(id) });
      return product;
    } catch (err) {
      throw new ApplicationError("Something went wrong with Database!", 200);
    }
  }

  async filter(minPrice, maxPrice, category) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const conditions = {};

      if (minPrice) {
        conditions.price = { $gte: parseFloat(minPrice) };
      }

      if (maxPrice) {
        conditions.price = { ...conditions.price, $lte: parseFloat(maxPrice) };
      }

      if (category) {
        conditions.category = category;
      }

      return await collection
        .find(conditions)
        .project({ name: 1, _id: 0, price: 1, sizes: { $slice: 2 } })
        .toArray();
    } catch (err) {
      throw new ApplicationError("Something went wrong with Database!", 200);
    }
  }

  // async rate(userID, productID, rating) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);

  //     const product = await collection.findOne({
  //       _id: new ObjectId(productID),
  //     });

  //     const userRating = await product?.ratings?.find(
  //       (r) => r.userID == userID
  //     );
  //     if (userRating) {
  //       // 3. Update the rating
  //       await collection.updateOne(
  //         {
  //           _id: new ObjectId(productID),
  //           "ratings.userID": new ObjectId(userID),
  //         },
  //         {
  //           $set: {
  //             "ratings.$.rating": rating,
  //           },
  //         }
  //       );
  //     } else {
  //       await collection.updateOne(
  //         { _id: new ObjectId(productID) },
  //         { $push: { ratings: { userID: new ObjectId(userID), rating } } }
  //       );
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }

  // async rate(userID, productID, rating) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);

  //     // 1. Removes existing entry
  //     await collection.updateOne(
  //       {
  //         _id: new ObjectId(productID),
  //       },
  //       {
  //         $pull: { ratings: { userID: new ObjectId(userID) } },
  //       }
  //     );

  //     // 2. Add new entry
  //     await collection.updateOne(
  //       {
  //         _id: new ObjectId(productID),
  //       },
  //       {
  //         $push: { ratings: { userID: new ObjectId(userID), rating } },
  //       }
  //     );
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }

  async rate(userID, productID, rating) {
    try {
      const product = ProductModel.findById(productID)
      if(!product){
         throw new Error("Product not found")
      }
      
      const reviewd = await reviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)})
      if(reviewd){
        reviewd.rating = rating
        await reviewd.save()
      }else{
        const newReview = new reviewModel({
          product:new ObjectId(productID),
          user:new ObjectId(userID),
          rating:rating
        })
        await newReview.save()
      }
      
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection
        .aggregate([
          {
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
              totalProducts: { $sum: 1 },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async averageRatings() {
    const db = getDB();
    const collection = db.collection(this.collection);
    return await collection
      .aggregate([
        { $unwind: "$ratings" },
        {
          $group: {
            _id: "$name",
            averageRating: { $avg: "$ratings.rating" },
          },
        },
      ])
      .toArray();
  }

  async totalRatingsEachProduct() {
    const db = getDB();
    const collection = db.collection(this.collection);
    return await collection
      .aggregate([
        {
          $project: {
            name: 1,
            _id: 0,
            countOfRating: {
              $cond: {
                if: { $isArray: "$ratings" },
                then: { $size: "$ratings" },
                else: 0,
              },
            },
          },
        },
        {
          $sort: { countOfRating: -1 },
        },
        // {
        //   $limit: 1,
        // }
      ])
      .toArray();
  }
}

export default ProductRepository;
