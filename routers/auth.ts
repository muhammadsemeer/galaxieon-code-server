import {
  Router,
  Request,
  Response,
  NextFunction,
  CookieOptions,
} from "express";
import { TokenPayload } from "google-auth-library";
import { githubVerfiy } from "../auth/github";
import googleAuth from "../auth/google";
import { createUserOrLogUser } from "../auth/handleUser";
import { createToken } from "../auth/token";
import { User } from "../types/User";

const router: Router = Router();

const cookieOption: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
};

router.post("/google", (req: Request, res: Response, next: NextFunction) => {
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
      .then((err) => next(err));
  } catch (err) {
    next(err);
  }
});

router.post("/github", (req: Request, res: Response, next: NextFunction) => {
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

export default router;
