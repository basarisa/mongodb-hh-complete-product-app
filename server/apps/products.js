import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (_req, res) => {
  try {
    const collection = db.collection("products");

    const results = await collection.find({}).toArray();
    return res.status(200).json({ data: results });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to geting product ${error.message}` });
  }
});

productRouter.get("/:id", async (req, res) => {});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");

    const productsData = { ...req.body };
    const doc = await collection.insertOne(productsData);

    return res.status(201).json({
      id: doc.insertedId,
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

    console.log(req.params.id);

    const isValidId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    if (!isValidId) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const productsId = new ObjectId(req.params.id);
    const newProductsdata = { ...req.body };

    console.log(newProductsdata);

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
    console.error("Error while updating product:", error);
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
