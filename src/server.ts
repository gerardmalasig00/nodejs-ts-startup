import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose from "mongoose";

const MONGO_DB_USER = process.env.MONGO_DB_USER;
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const MONGO_DB_HOST = process.env.MONGO_DB_HOST;
const MONGO_DB_PORT = process.env.MONGO_DB_PORT;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const PORT = process.env.PORT || 3000;

const MONGO_URI = `mongodb://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}?authSource=admin`;

mongoose
  .connect(MONGO_URI, { family: 4 })
  .then(() => console.info("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });

const server = app.listen(PORT, () => {
  console.info(`Server listening on ${PORT}`);
});

process.on("SIGINT", async () => {
  console.info("SIGINT received, shutting down...");
  await mongoose.disconnect();
  server.close(() => process.exit(0));
});
