import { createClient } from "redis";
import { Redis } from "@upstash/redis";

let redis: any;

if (process.env.NODE_ENV === "production") {
  redis = new Redis({
    url: "https://cool-lemming-84350.upstash.io",
    token:
      "gQAAAAAAAUl-AAIncDIzZjcwZGY1NzI3YTI0MDgzOTYwMDdmYTA5MGRhNzJmNnAyODQzNTA",
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
