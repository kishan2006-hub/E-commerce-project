import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import { ApplicationError } from "../../error-hendler/application.error.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    try {
      const db = getDB();
      const client = getClient();
      const session = client.startSession();
      session.startTransaction();

      // 1. Get cartitems and calculate total amount.
      const items = await this.getTotalAmount(userId, session);
      const finalTotalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );

      // 2. Create an order record.
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );
      db.collection(this.collection).insertOne(newOrder, { session });

      // 3. Reduce the stock.
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productID },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }

      // 4. Clear the cart items.
      db.collection("cart").deleteMany(
        { userID: new ObjectId(userId) },
        { session }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getTotalAmount(userId, session) {
    const db = getDB();
    const items = await db
      .collection("cart")
      .aggregate(
        [
          { $match: { userID: new ObjectId(userId) } },
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          { $unwind: "$productInfo" },
          {
            $addFields: {
              totalAmount: { $multiply: ["$productInfo.price", "$quantity"] },
            },
          },
        ],
        { session }
      )
      .toArray();

    return items;
  }
}
