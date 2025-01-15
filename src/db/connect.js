import mongoose from "mongoose";
const connectDB=async(DB_URL)=> {
  try {
    const DB_OPTIONS = {
      dbName: "earningSystem",
    };
    await mongoose.connect(DB_URL, DB_OPTIONS);
    console.log(`mongodb connected successfully.`);
  } catch (err) {
    console.log("Error in connect db", err.message);
  }
}
export default connectDB;
