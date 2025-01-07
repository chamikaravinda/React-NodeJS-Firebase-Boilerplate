import express from "express";
import dotenv from "dotenv";
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import serviceAccount from '../next-node-firebase-boile-0b69b5bc97cf.json' assert { type: "json" };

dotenv.config();


initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
