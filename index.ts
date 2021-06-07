import dotenv from "dotenv";
import express from "express";
import Connection from "./connection";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

dotenv.config();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
// app.use("/groups", groupRoutes);
// app.use("/object", objectRoutes);

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
