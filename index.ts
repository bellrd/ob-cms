import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import authRoutes from "./authRoutes";
import groupRoutes from "./groupRoutes";
import userRoutes from "./userRoutes";
import objectRoutes from "./objectRoutes";

dotenv.config();

const PORT = 8000;
const app = express();
app.use(express.json({ type: "application/json" }));
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/groups", groupRoutes);
app.use("/objects", objectRoutes);
app.get("/hello", (req, res) => {
  return res.sendFile(path.join(__dirname, "./index.html"));
});

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
