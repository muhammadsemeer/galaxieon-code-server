import { RequestWithUser, User, UserToken } from "../types/User";
import { sign, verify } from "jsonwebtoken";
import { config } from "dotenv";
import { Response, NextFunction } from "express";
import { cookieOption } from "../app";
import { checkUserActive } from "./handleUser";

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

export const verifyToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  let accessToken: string = req.cookies.accessToken,
    refreshToken: string = req.cookies.refreshToken;
  if (accessToken && refreshToken) {
    verifyAccessToken(accessToken, next)
      .then((result) => {
        req.user = result;
        return next();
      })
      .catch((err) => {
        verifyRefreshToken(refreshToken, next)
          .then((result) => {
            createAccessToken(result, req, res, next);
          })
          .catch((err) => {
            next({ message: "User not Authentictaed", status: 403 });
          });
      });
  } else if (!accessToken && refreshToken) {
    verifyRefreshToken(refreshToken, next)
      .then((result) => {
        createAccessToken(result, req, res, next);
      })
      .catch((err) => {
        next({ message: "User not Authentictaed", status: 403 });
      });
  } else {
    next({ message: "User not Authentictaed", status: 403 });
  }
};

function verifyAccessToken(
  token: string,
  next: NextFunction
): Promise<Object | undefined> {
  return new Promise((resolve, reject) => {
    verify(token, process.env.JWT_SECRET as string, async (err, decoded) => {
      if (err) return reject(err);
      if (await checkUserActive(decoded as UserToken))
        return next({ status: 403, message: "User Blocked" });
      resolve(decoded);
    });
  });
}

function verifyRefreshToken(
  token: string,
  next: NextFunction
): Promise<Object | undefined> {
  return new Promise((resolve, reject) => {
    verify(
      token,
      process.env.JWT_REFRESH_TOKEN as string,
      async (err, decoded) => {
        if (err) return reject(err);
        if (await checkUserActive(decoded as UserToken))
          return next({ status: 403, message: "User Blocked" });
        resolve(decoded);
      }
    );
  });
}

export const createAccessToken = (
  user: User | any,
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const { id, name, email }: User = user;
  let accessToken = sign(
    { id, name, email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
  req.user = user;
  res.cookie("accessToken", accessToken, {
    ...cookieOption,
    expires: new Date(Date.now() + 86400000),
  });
  return next();
};
