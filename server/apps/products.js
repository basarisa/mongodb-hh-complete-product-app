import { Router } from "express";
import { ObjectId } from "mongodb";
import { db } from "../utils/db.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const products = await collection.find({}).toArray();

    return res.status(200).json({ data: products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to fetch products ${error.message}` });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productsId = new ObjectId(req.params.id);

    const product = await collection.findOne({ _id: productsId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ data: product });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch product" });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productsdata = { ...req.body };

    await collection.insertOne(productsdata);

    return res.status(201).json({
      message: "Product has been created successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to create product ${error.message}` });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productsId = new ObjectId(req.params.id);
    const newProductsdata = { ...req.body };

    const result = await collection.updateOne(
      { _id: productsId },
      { $set: newProductsdata }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product has been updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to update product ${error.message}` });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productsId = new ObjectId(req.params.id);

    const result = await collection.deleteOne({ _id: productsId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product has been deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to delete product ${error.message}` });
  }
});

export default productRouter;
