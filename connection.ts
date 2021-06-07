import dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";
dotenv.config();

class Connection {
  static db: any;
  static options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  static async open(): Promise<Db | undefined> {
    if (this.db) return this.db;
    try {
      let client = new MongoClient(
        process.env.CONNECTION_STRING!,
        this.options
      );
      await client.connect();
      this.db = client.db("cms");
      return this.db;
    } catch (error) {
      console.error("Error while connecting to mongodb");
      console.error({ error });
    }
  }
}

export default Connection;
