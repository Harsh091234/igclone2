import { IUser } from ".././modules/user/user.model.js";

export const sanitizeUser = (user: IUser | any) => {
  if (!user) return null;

  // Convert to plain object if it's a Mongoose document
  const obj = typeof user.toJSON === "function" ? user.toJSON() : { ...user };

  // Remove sensitive fields
  const {
    password,
    refreshToken,
    tokenVersion,
    emailVerificationToken,
    emailVerificationTokenExpiresAt,
    passwordResetToken,
    passwordResetTokenExpiresAt,
    __v,
    ...safeUser
  } = obj;

  return safeUser;
};