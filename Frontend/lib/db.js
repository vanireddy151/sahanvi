import mongoose from "mongoose";

const globalForMongoose = globalThis;

export async function connectDB() {
  if (globalForMongoose.mongooseConnection) {
    return globalForMongoose.mongooseConnection;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing.");
  }

  globalForMongoose.mongooseConnection = await mongoose.connect(uri);
  return globalForMongoose.mongooseConnection;
}
