import express from "express";
import { ObjectId } from "mongodb";
import { hashPassword } from "../authRoutes/utility";
import { adminRequired, loginRequired } from "../middlewares";
import DbConnection from "../mongo";

const router = express.Router();

router.use(loginRequired);
router.use(adminRequired);

router.get("/", async (req, res) => {
  let db = await DbConnection.open();
  let userCollection = db?.collection("users");
  let users = await userCollection
    ?.find({}, { projection: { password: 0 } })
    .toArray();
  return res.json(users);
});

router.post("/", async (req, res) => {
  let name = req.body.fullName || "";
  let email = req?.body?.email;
  let password1 = req.body.password1;
  let password2 = req.body.password2;
  let isActive = (req.body.isActive as Boolean) || false;
  let isAdmin = (req.body.isAdmin as Boolean) || false;
  let mobileNumber = req.body.mobileNumber || "";

  let db = await DbConnection.open();
  let userCollection = db?.collection("users");

  if (password1 != password2)
    return res.status(400).json({ error: "password does not match" });
  let user = await userCollection?.findOne({ email });
  if (user) return res.status(400).json({ error: "Email already exist" });

  let result = await userCollection?.insertOne({
    name,
    email,
    password: await hashPassword(password2),
    isActive,
    isAdmin,
    cratedAt: new Date(),
    mobileNumber,
  });
  return res.status(201).json({ ...result?.ops[0], password: undefined });
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let db = await DbConnection.open();
  let userCollection = db?.collection("users");
  let user = await userCollection?.findOne({ _id: new ObjectId(id) });
  if (!user) return res.status(400).json({ error: "Not such user" });
  return res.json({ ...user, password: undefined });
});

router.put("/:id", async (req, res) => {
  let id = req.params.id;
  let db = await DbConnection.open();
  let userCollection = db?.collection("users");
  let user = await userCollection?.findOne({ _id: new ObjectId(id) });
  if (!user) return res.status(404).json({ error: "not found" });

  let name = req.body.name ?? user.name;
  let isAdmin = req.body.isAdmin ?? user.isAdmin;
  let isActive = req.body.isActive ?? user.isActive;
  let mobileNumber = req.body.mobileNumber ?? user.mobileNumber;

  let result = await userCollection?.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { name, isAdmin, isActive, mobileNumber } },
    { returnDocument: "after" }
  );
  if (!result?.value) return res.status(404).json({ error: "Not found" });
  return res.json(result.value);
});

router.post("/set-password/:id", async (req, res) => {
  let id = req.params.id;
  let password1 = req.body.password1;
  let password2 = req.body.password2;

  if (password1 != password2)
    return res.status(400).json({ error: "password does not match" });

  const hashedPassword = hashPassword(password2);

  let db = await DbConnection.open();
  let userCollection = db?.collection("users");
  let result = await userCollection?.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { password: hashedPassword } }
  );
  // remove all user session if exist
  if (!result?.value) return res.status(404).json({ error: "No such user" });
  return res.json({ message: "success" });
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let db = await DbConnection.open();
  let userCollection = db?.collection("users");
  let result = await userCollection?.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (!result?.value) return res.status(400).json({ error: "No such user" });
  // destroy any session for that user
  return res.json(result.value);
});

export default router;
