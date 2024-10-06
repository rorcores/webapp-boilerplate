import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
export interface AuthenticatedRequest extends Request {
  userId?: string;
  email?: string;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.SUPABASE_JWT_SECRET!,
    ) as JwtPayload;
    
    if (
      decoded &&
      typeof decoded === "object" &&
      "sub" in decoded &&
      "email" in decoded
    ) {
      req.userId = decoded.sub as string;
      req.email = decoded.email as string;
      next();
    } else {
      return res.status(401).json({ message: "Invalid token structure" });
    }
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
