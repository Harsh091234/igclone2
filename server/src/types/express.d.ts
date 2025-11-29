import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      auth?: () => { userId: string }; // define your auth method
    }
  }
}
