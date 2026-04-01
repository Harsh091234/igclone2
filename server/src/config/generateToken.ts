import crypto from "crypto";

export const generateHashedToken = (expiresInMinutes?: number) => {
  const expiresIn = expiresInMinutes ?? 5;

  const rawToken = crypto.randomBytes(20).toString("hex"); // for user

  const hashedToken = crypto // for db
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // 3️⃣ expiry time
  const expiresAt = new Date(Date.now() + expiresIn * 60 * 1000);

  return {
    rawToken,
    hashedToken,
    expiresAt,
  };
};
