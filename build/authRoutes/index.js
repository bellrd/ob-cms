"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("../connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(10);
    return bcrypt_1.default.hash(password, salt);
});
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let db = yield connection_1.default.open();
        let userCollection = db === null || db === void 0 ? void 0 : db.collection("users");
        let user = yield (userCollection === null || userCollection === void 0 ? void 0 : userCollection.findOne({ email }));
        if (!user)
            return res.status(401).json({ error: "Invalid email or password" });
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (validPassword && user.isActive) {
            return res.status(200).json({ message: "You are logged in" });
        }
        else
            return res.status(401).json({ error: "Invalid email or password" });
    }
    catch (error) {
        return res.json(error);
    }
}));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let email = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email;
    let password1 = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.password1;
    let password2 = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.password2;
    let db = yield connection_1.default.open();
    let userCollection = db === null || db === void 0 ? void 0 : db.collection("users");
    if (password1 != password2)
        return res.status(400).json({ error: "password does not match" });
    let user = yield (userCollection === null || userCollection === void 0 ? void 0 : userCollection.findOne({ email }));
    if (user)
        return res.status(400).json({ error: "Email already exist" });
    let result = yield (userCollection === null || userCollection === void 0 ? void 0 : userCollection.insertOne({
        email,
        password: yield hashPassword(password2),
    }));
    return res.json(result);
}));
exports.default = router;
