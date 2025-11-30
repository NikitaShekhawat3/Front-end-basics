import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import productRoutes from "./routes/productRoute.js"; // ✅ correct filename
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// 🖼 Serve static image files
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/product", productRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the API 🚀' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.DEV_MODE} mode`);
});
