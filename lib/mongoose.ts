import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL) return console.log("Missing MongoDB URL");

  // If the connection is already established, return without creating a new connection.
  if (isConnected) {
    console.log("MongoDB connection already established");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connected to MONGODB");
  } catch (error) {
    console.log("Error connecting to MONGODB", error);
  }
};
