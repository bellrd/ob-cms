import { ObjectId } from "bson";
import { NextFunction, Request, Response } from "express";
import { setSecureHttpCookie } from "../authRoutes/utility";
import DbConnection from "../mongo";
import RedisConnection from "../redis";
import dotenv from "dotenv";

dotenv.config();

export const loginRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let sessionId = req?.cookies?.sessionId;
  if (!sessionId)
    return res.status(401).json({ error: "Authentication required" });

  let client = await RedisConnection.open();
  let userId = await client.get(sessionId);
  if (!userId) {
    setSecureHttpCookie(res, process.env.SESSION_COOKIE_NAME!, "", 0);
    return res.status(401).json({ error: "Authentication required" });
  }
  let db = await DbConnection.open();
  let userCollection = db?.collection("users");
  let user = await userCollection?.findOne({ _id: new ObjectId(userId) });
  if (!user.isActive)
    return res.status(400).json({ error: "Your account is not active" });
  req.body.user = user;
  next();
};

// must be called after loginRequired
export const adminRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = req.body?.user;
  if (!user) return res.status(401).json({ error: "Authentication required" });
  if (!user.isAdmin)
    return res.status(401).json({ error: "You are not admin" });
  next();
};
