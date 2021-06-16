import { Router, Request, Response, NextFunction } from "express";
import { TokenPayload } from "google-auth-library";
import { githubVerfiy } from "../auth/github";
import googleAuth from "../auth/google";
import { createUserOrLogUser } from "../auth/handleUser";
import { createToken, verifyToken } from "../auth/token";
import { RequestWithUser, User } from "../types/User";
import { cookieOption } from "../app";

const router: Router = Router();

router.post("/google", (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token) return next({ status: 400, message: "Token Required" })
  try {
    googleAuth(req.body.token)
      .then((payload: TokenPayload) =>
        createUserOrLogUser(payload, (err: Error, user: User, code: number) => {
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
            .json({ login: true, user });
        })
      )
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
});

router.post("/github", (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.token) return next({ status: 400, message: "Token Required" })
  try {
    githubVerfiy(req.body.token)
      .then((payload: any) =>
        createUserOrLogUser(
          {
            name: payload.name,
            email: payload.login,
            picture: payload.avatar_url,
          },
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
              .json({ login: true, user });
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

export default router;
