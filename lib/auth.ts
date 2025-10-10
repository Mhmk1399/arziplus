import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyToken(token);
}
