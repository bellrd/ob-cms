import express from "express";
import Connection from "../connection";
import bcrypt from "bcrypt";

const router = express.Router();

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

router.post("/login", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let db = await Connection.open();
    let userCollection = db?.collection("users");
    let user = await userCollection?.findOne({ email });

    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword && user.isActive) {
      return res.status(200).json({ message: "You are logged in" });
    } else return res.status(401).json({ error: "Invalid email or password" });
  } catch (error) {
    return res.json(error);
  }
});

router.post("/register", async (req, res) => {
  let email = req?.body?.email;
  let password1 = req?.body?.password1;
  let password2 = req?.body?.password2;

  let db = await Connection.open();
  let userCollection = db?.collection("users");

  if (password1 != password2)
    return res.status(400).json({ error: "password does not match" });
  let user = await userCollection?.findOne({ email });
  if (user) return res.status(400).json({ error: "Email already exist" });

  return userCollection?.insertOne(
    {
      email,
      password: await hashPassword(password2),
    },
    () => res.json({ message: "success" })
  );
});

export default router;
