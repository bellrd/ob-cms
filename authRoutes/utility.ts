import bcrypt from "bcrypt";
import cookie from "cookie";
import crypto from "crypto";
import { Response } from "express";

export const generateSessionId = async (): Promise<string> => {
  return crypto.randomBytes(16).toString("base64");
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const setSecureHttpCookie = async (
  res: Response,
  name: string,
  value: string,
  maxAge: number = 0
) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(name, value, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge,
      path: "/",
    })
  );
};
