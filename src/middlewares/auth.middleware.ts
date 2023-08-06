import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Express Request type to add the userId property
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization header not found" });
  }

  try {
    const decodedToken = jwt.verify(token, "your_secret_key");
    req.userId = (decodedToken as any).userId; // Cast decodedToken to any to access the userId property
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
