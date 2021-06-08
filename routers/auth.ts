import {
  Router,
  Request,
  Response,
  NextFunction,
  CookieOptions,
} from "express";
import { TokenPayload } from "google-auth-library";
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
    googleAuth(req.body.token).then((payload: TokenPayload) =>
      createUserOrLogUser(payload, (err: Error, user: User,code: number) => {
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
    );
  } catch (err) {
    next(err);
  }
});

export default router;
