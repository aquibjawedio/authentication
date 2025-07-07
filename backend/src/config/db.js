import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(env.DATABASE_URL);
    console.log("MONGODB CONNECTED SUCCESSFULL", res.connection.host);
  } catch (error) {
    console.log("FAILED TO CONNECT MONGODB", error.message);
    process.exit(1);
  }
  mongoose.connection.on("error", (error) => {
    console.log("MONGOOSE RUNTIME ERROR : ", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MONGOOSE DISCONNECTED");
  });
};

export { connectDB };
