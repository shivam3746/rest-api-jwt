import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./src/routes/auth.route";
import todoRoute from "./src/routes/todo.route";
import * as redis from 'redis';

dotenv.config();

const app = express();
const PORT = 3456;

// Middleware
app.use(express.json());

// Create a Redis client
const url = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = redis.createClient({
    url
});

// Check if the Redis client is connected
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

// Redis error handling
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Add the Redis client to the Express app locals so it can be accessed in routes
app.locals.redisClient = redisClient;

// Routes
app.use("/api/auth", authRoute);
app.use("/api/todos", todoRoute);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tododb", {
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the application on MongoDB connection error
  });

export default app;




