import express from "express";
import { ObjectId } from "mongodb";
import { adminRequired, loginRequired } from "../middlewares";
import DbConnection from "../mongo";

const router = express.Router();

router.get("/", loginRequired, async (req, res) => {
  let db = await DbConnection.open();
  let collection = db?.collection("groups");
  let groups = await collection?.find({}).toArray();
  return res.json(groups);
});

router.post("/", loginRequired, adminRequired, async (req, res) => {
  let name = req.body?.name?.toLowerCase();
  let description = req.body?.description;
  let createdAt = new Date();
  let db = await DbConnection.open();
  let collection = db?.collection("groups");
  let group = await collection?.findOne({ name });
  if (group) return res.status(400).json({ error: `${name} already exists` });
  let result = await collection?.insertOne({ name, description, createdAt });
  return res.status(201).json(result?.ops[0]);
});

router.get("/:id", loginRequired, async (req, res) => {
  let id = req.params?.id;
  let db = await DbConnection.open();
  let collection = db?.collection("groups");
  let group = await collection?.findOne({ _id: new ObjectId(id) });
  if (!group) return res.status(404).json({ error: "No such groups" });
  return res.json(group);
});

router.put("/:id", loginRequired, adminRequired, async (req, res) => {
  let id = req.params?.id;
  let name = req.body?.name;
  let description = req.body?.description;
  let db = await DbConnection.open();
  let collection = db?.collection("groups");
  let result = await collection?.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { name, description } },
    { returnDocument: "after" }
  );
  if (!result?.value) return res.status(404).json({ error: "not found" });
  return res.json(result?.value);
});

router.delete("/:id", loginRequired, adminRequired, async (req, res) => {
  let id = req.params.id;
  let db = await DbConnection.open();
  let collection = db?.collection("groups");
  let result = await collection?.findOneAndDelete({ _id: new ObjectId(id) });
  if (!result?.value) return res.status(404).json({ error: "Not found" });

  return res.json(result?.value);
});

export default router;
