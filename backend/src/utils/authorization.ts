import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export function verifyToken(request: Request, response: Response, next: NextFunction) {
  const token = request.header("app-token") || "";

  console.log("[middleware auth]: ", token);

  if (token && typeof token !== "undefined" && token !== null) {
    jwt.verify(token, String(process.env.SECRET), (err, decoded) => {
      if (decoded) {
        next();
      } else {
        return response.status(203).json({ 
          failed: true, 
          isAuthenticated: false,
          message: "Sessão expirada."
        });
      }
    });
  } else {
    return response.status(203).json({ 
      failed: true, 
      isAuthenticated: false,
      message: "Token inválido."
    });
  }
}