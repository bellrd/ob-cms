import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

class RedisConnection {
  static client: Redis.Redis;
  static async open(): Promise<Redis.Redis> {
    if (this.client) return this.client;
    let redisClient = new Redis(
      process.env.REDIS_PORT as unknown as number,
      process.env.REDIS_HOST!,
      {
        db: process.env.REDIS_DB as unknown as number,
        password: process.env.REDIS_PASSWORD,
      }
    );
    this.client = redisClient;
    return this.client;
  }
}

export default RedisConnection;
