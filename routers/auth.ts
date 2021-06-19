import { Router, Request, Response, NextFunction } from "express";
import { TokenPayload } from "google-auth-library";
import { githubVerfiy } from "../auth/github";
import googleAuth from "../auth/google";
import { createUserOrLogUser, logAdmin } from "../auth/handleUser";
import { createToken, verifyToken } from "../auth/token";
import { RequestWithUser, User } from "../types/User";
import { cookieOption } from "../app";
import JWT from "jsonwebtoken";

const router: Router = Router();

router.post("/google", (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token) return next({ status: 400, message: "Token Required" });
  try {
    googleAuth(req.body.token)
      .then((payload: TokenPayload) =>
        createUserOrLogUser(
          payload,
          "google",
          (err: Error, user: User, code: number) => {
            if (err) return next(err);
            let { accessToken, refreshToken } = createToken(user);
            res
              .cookie("accessToken", accessToken, {
                ...cookieOption,
                expires: new Date(Date.now() + 86400000),
              })
              .cookie("refreshToken", refreshToken, {
                ...cookieOption,
                expires: new Date(Date.now() + 5184000000),
              })
              .status(code)
              .json({
                login: true,
                isNewUser: code === 201 ? true : false,
                user,
              });
          }
        )
      )
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
});

router.post("/github", (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token) return next({ status: 400, message: "Token Required" });
  try {
    githubVerfiy(req.body.token)
      .then((payload: any) =>
        createUserOrLogUser(
          {
            name: payload.name,
            email: payload.login,
            picture: payload.avatar_url,
          },
          "github",
          (err: Error, user: User, code: number) => {
            if (err) return next(err);
            let { accessToken, refreshToken } = createToken(user);
            res
              .cookie("accessToken", accessToken, {
                ...cookieOption,
                expires: new Date(Date.now() + 86400000),
              })
              .cookie("refreshToken", refreshToken, {
                ...cookieOption,
                expires: new Date(Date.now() + 5184000000),
              })
              .status(code)
              .json({
                login: true,
                isNewUser: code === 201 ? true : false,
                user,
              });
          }
        )
      )
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
});

router.get(
  "/check",
  verifyToken,
  (req: RequestWithUser | any, res: Response) => {
    res.json(req.user);
  }
);

router.post("/admin", (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token) return next({ status: 400, message: "Token Required" });
  try {
    googleAuth(req.body.token)
      .then((payload: TokenPayload) =>
        logAdmin(payload, (err: Error, admin: User) => {
          if (err) return next(err);
          let token = JWT.sign(
            { id: admin.id, name: admin.name, email: admin.email },
            process.env.JWT_ADMIN as string,
            {
              expiresIn: "1d",
            }
          );
          res
            .cookie("admAcess", token, {
              ...cookieOption,
              expires: new Date(Date.now() + 86400000),
            })
            .json({
              login: true,
              admin,
            });
        })
      )
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
});

export default router;
