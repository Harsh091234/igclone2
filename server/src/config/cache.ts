import redis from "./redis.js";

export const getCache = async (key: string) => {
  return await redis.get(key);
};

export const setCache = async (key: string, value: any, ttl = 60) => {
  if (process.env.NODE_ENV === "production") {
    await redis.set(key, JSON.stringify(value), { ex: ttl });
  } else {
    await redis.setEx(key, ttl, JSON.stringify(value));
  }
};

export const deleteCache = async (key: string) => {
  await redis.del(key);
};