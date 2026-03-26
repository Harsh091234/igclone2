import { createClient } from "redis";
import { Redis } from "@upstash/redis";

let redis: any;

if (process.env.NODE_ENV === "production") {
  redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  });
} else {
  redis = createClient({
    url: "redis://127.0.0.1:6379",
  });

  redis.on("error", (err: any) => {
    console.log("redis error:", err);
  });

  (async () => {
    await redis.connect();
  })();
}

export default redis;
