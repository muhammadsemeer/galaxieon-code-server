import { Request } from "express";
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
  followers?: number;
  following?: number;
  status?: boolean;
}

export interface RequestWithUser extends Request {
  user: any;
}
