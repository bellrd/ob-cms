import express from "express";
import { ObjectId } from "mongodb";
import Connection from "../connection";

const router = express.Router();

router.get("/", async (req, res) => {
  let db = await Connection.open();
  let userCollection = db?.collection("users");
  let user = await userCollection
    ?.find({}, { projection: { password: 0 } })
    .toArray();
  return res.json(user);
});

router.post("/", (req, res) => {
  return res.json(req.body);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let db = await Connection.open();
  let userCollection = db?.collection("users");
  let user = await userCollection?.findOne({ _id: new ObjectId(id) });
  return res.json({ ...user, password: undefined });
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let db = await Connection.open();
  let userCollection = db?.collection("users");
  let result = await userCollection?.deleteOne({ _id: new ObjectId(id) });
  return res.json({ message: "deleted" });
});

export default router;
