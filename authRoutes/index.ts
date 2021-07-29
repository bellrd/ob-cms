import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import { loginRequired } from "../middlewares";
import DbConnection from "../mongo";
import RedisConnection from "../redis";
import {
  generateSessionId,
  hashPassword,
  setSecureHttpCookie,
} from "./utility";

dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let db = await DbConnection.open();
    let userCollection = db?.collection("users");
    let user = await userCollection?.findOne({ email });

    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword && user.isActive) {
      let sessionId = await generateSessionId();
      await setSecureHttpCookie(
        res,
        process.env.SESSION_COOKIE_NAME!,
        sessionId,
        60 * 60 * 24 * 7 * 30
      );
      let redis = await RedisConnection.open();
      await redis.set(sessionId, user._id.toString());
      return res.json({ message: "Logged in" });
    } else
      return res
        .status(401)
        .json({ error: "Invalid email or password or account is not active" });
  } catch (error) {
    return res.json(error);
  }
});

router.post("/set-password", loginRequired, async (req, res) => {
  let password1 = req.body.password1;
  let password2 = req.body.password2;
  if (password1 != password2)
    return res.status(400).json({ error: "Password does not match" });
  let db = await DbConnection.open();
  let userCollection = db?.collection("users");
  let hashedPassword = await hashPassword(password2);
  await userCollection?.findOneAndUpdate(
    { _id: req.body.user._id },
    { $set: { password: hashedPassword } }
  );
  return res.json({ message: "Password updated" });
});

router.get("/logout", loginRequired, async (req, res) => {
  await setSecureHttpCookie(res, process.env.SESSION_COOKIE_NAME!, "", 0);
  return res.json({ message: "Logged out" });
});

// router.post("/register", async (req, res) => {
//   let email = req?.body?.email;
//   let password1 = req.body.password1;
//   let password2 = req.body.password2;
//   let isActive = req.body.isActive as Boolean;
//   let isAdmin = req.body.isAdmin as Boolean;

//   let db = await DbConnection.open();
//   let userCollection = db?.collection("users");

//   if (password1 != password2)
//     return res.status(400).json({ error: "password does not match" });
//   let user = await userCollection?.findOne({ email });
//   if (user) return res.status(400).json({ error: "Email already exist" });

//   let result = await userCollection?.insertOne({
//     email,
//     password: await hashPassword(password2),
//     isActive: isActive || false,
//     isAdmin: isAdmin || false,
//   });
//   return res.status(201).json({ ...result?.ops[0], password: undefined });
// });

export default router;
