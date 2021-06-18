import { Request } from "express";
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
  followers?: number;
  following?: number;
  authType?: "google" | "github";
  status?: "active" | "blocked" | "deleted";
}

export interface RequestWithUser extends Request {
  user: any;
}
