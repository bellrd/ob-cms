import { ObjectId } from "bson";
import express from "express";
import { loginRequired } from "../middlewares";
import DbConnection from "../mongo";
import multer from "multer";
let router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.get("/", loginRequired, async (req, res) => {
  let db = await DbConnection.open();
  let collection = db?.collection("objects");
  let objects: any[] | undefined = [];
  if (req.body.user.isAdmin) {
    let objects = await collection?.find({}).toArray();
  }
  return res.json(objects);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  let db = await DbConnection.open();
  let collection = db?.collection("objects");
  let object = await collection?.findOne({ _id: new ObjectId(id) });
  return res.json(object);
});

router.put("/:id", async (req, res) => {});

router.post("/", upload.single("file"), async (req, res) => {
  // let db = await DbConnection.open();
  // let collection = db?.collection("objects");
  return res.json(req.file);
});

router.delete("/:id", async (req, res) => {});

export default router;
