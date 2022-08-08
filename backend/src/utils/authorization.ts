import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export function verifyToken(request: Request, response: Response, next: NextFunction) {
  const token = request.header("app-token") || "";

  if (token && typeof token !== "undefined" && token !== null) {
    jwt.verify(token, String(process.env.SECRET), (err, decoded: any) => {
      if (decoded) {
        request.headers["current-user-email"] = decoded.email;
        next();

      } else response.status(500).json({ logout: true });
    });
  } else response.status(500).json({ logout: true });
}