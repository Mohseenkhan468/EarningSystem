import express from "express";
import "dotenv/config";
import connectDB from "./src/db/connect.js";
import UserRouter from "./src/routers/user.router.js";
import cors from 'cors'
const app = express();
const PORT = process.env.PORT||5000;
const DB_URL=process.env.DB_URL||'mongodb://localhost:27017';
app.use(cors());
app.get("/", (req, res) => {
  return res.send("Hello");
});
app.use(express.json());
app.use("/users", UserRouter);
connectDB(DB_URL);
app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
