import Product from "../models/productModel.js";
import fs from "fs";

// ✅ ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? req.file.path : null; // multer stores image file path

    if (!name || !price) {
      return res.status(400).send({
        success: false,
        message: "Product name and price are required",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image,
    });

    await product.save();
    res.status(201).send({
      success: true,
      message: "✅ Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "❌ Error adding product",
      error,
    });
  }
};

// ✅ GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "❌ Error fetching all products",
      error,
    });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }

    // 🖼 Delete the image from uploads folder if exists
    if (product.image && fs.existsSync(product.image)) {
      fs.unlinkSync(product.image);
    }

    await Product.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "🗑️ Product deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "❌ Error deleting product",
      error,
    });
  }
};

// ✅ UPDATE OR RESTOCK PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // 🖼 If a new image is uploaded, replace the old one
    if (req.file) {
      const product = await Product.findById(id);
      if (product?.image && fs.existsSync(product.image)) {
        fs.unlinkSync(product.image);
      }
      updates.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).send({
      success: true,
      message: "✅ Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "❌ Error updating product",
      error,
    });
  }
};

// ✅ GET PRODUCTS BY CATEGORY
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });

    if (products.length === 0) {
      return res.status(404).send({
        success: false,
        message: `No products found in ${category}`,
      });
    }

    res.status(200).send({
      success: true,
      message: `✅ Products fetched for ${category}`,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "❌ Error fetching products by category",
      error,
    });
  }
};
