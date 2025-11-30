import express from "express";
import {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProductsByCategory, // ✅ Added missing import
} from "../controllers/productController.js";

import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ✅ Get all products (for everyone)
router.get("/", getAllProducts);

// ✅ Add product (Admin only)
router.post("/add", requireSignIn, isAdmin, upload.single("image"), addProduct);

// ✅ Delete product (Admin only)
router.delete("/:id", requireSignIn, isAdmin, deleteProduct);

// ✅ Update / Restock product (Admin only)
router.put("/:id", requireSignIn, isAdmin, upload.single("image"), updateProduct);

// ✅ Get products by category (Public)
router.get("/category/:category", getProductsByCategory);

export default router;
