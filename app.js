import express from "express";
import "dotenv/config";
import connectDB from "./src/db/connect.js";
import UserRouter from "./src/routers/user.router.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017";
app.use(cors());
app.get("/", (req, res) => {
  return res.send("Hello");
});
app.use(express.json());
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Earning System API",
      version: "1.0.0",
      description: "API documentation for my project",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/routers/user.router.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/users", UserRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get("/", (req, res) => {
  res.send("Hello");
});
connectDB(DB_URL);
app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
