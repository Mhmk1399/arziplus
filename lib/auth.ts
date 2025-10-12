import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface AuthUser {
  id: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  phone?: string;
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

// Client-side JWT token decoder (without verification)
export function decodeClientToken(token: string): AuthUser | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as AuthUser;
  } catch {
    return null;
  }
}

// Get current authenticated user from localStorage
export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("authToken");
  if (!token) return null;

  return decodeClientToken(token);
}
