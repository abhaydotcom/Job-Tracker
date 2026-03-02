import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/nextjs";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

let isConnected = 0;

export async function connectDB() {
  if (isConnected) return;

  const db = await mongoose.connect(MONGODB_URI);
  isConnected = db.connections[0].readyState;
}
