import express from "express";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(config.port, () => {
  console.log(`Server is running @ ${config.hostUrl}`);
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
