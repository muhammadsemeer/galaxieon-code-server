import { Router, Response, NextFunction } from "express";
import { verifyAdmin } from "../auth/token";
import { RequestWithAdmin, User } from "../types/User";
import UserDetails from "../helpers/admin/user";
import { createUserOrLogUser } from "../auth/handleUser";
import { nextTick } from "process";

const router: Router = Router();

// Middleware for verfiying admin
router.use(verifyAdmin);

router.post(
  "/user",
  (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    const { name, email, picture, type } = req.body;
    if (!name || !email || !type)
      return next({ status: 400, message: "Name, Email and Type required" });
    createUserOrLogUser(
      { name, email, picture },
      type,
      (err: Error, user: User, code: Number) => {
        if (err) return next(err);
        if (code === 200)
          return res.json({
            status: false,
            user: null,
            message: "User Already Exists",
          });
        res.status(201).json({ status: true, user });
      }
    );
  }
);

router.get(
  "/users",
  (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    UserDetails.getAllUsers()
      .then((users) => res.json(users))
      .catch((err) => next(err));
  }
);

router.get(
  "/user/:id",
  (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    UserDetails.getOneUser(req.params.id)
      .then((user) => res.json(user))
      .catch((err) => next(err));
  }
);

export default router;
