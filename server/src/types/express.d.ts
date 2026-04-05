import { IUser } from "../modules/user/user.model.ts";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      auth?: () => { userId: string }; // define your auth method
      user?: IUser
    }
  }
}
