"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
dotenv_1.default.config();
const app = express_1.default();
const PORT = 8000;
app.use(express_1.default.json());
app.use("/auth", authRoutes_1.default);
app.use("/users", userRoutes_1.default);
// app.use("/groups", groupRoutes);
// app.use("/object", objectRoutes);
app.listen(PORT, () => {
    console.log(`App running on ${PORT}`);
});
