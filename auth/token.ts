import { User } from "../types/User";
import { sign } from "jsonwebtoken";
import { config } from "dotenv";
config();

export const createToken = (
  user: User
): { accessToken: string; refreshToken: string } => {
  const { id, name, email }: User = user;
  let accessToken = sign(
    { id, name, email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
  let refreshToken = sign(
    { id, name, email },
    process.env.JWT_REFRESH_TOKEN as string,
    {
      expiresIn: "60d",
    }
  );

  return { accessToken, refreshToken };
};
