import { Router, Response, NextFunction } from "express";
import { verifyAdmin } from "../auth/token";
import { RequestWithAdmin } from "../types/User";
import UserDetails from "../helpers/admin/user";

const router: Router = Router();

// Middleware for verfiying admin
router.use(verifyAdmin);

router.get(
  "/users",
  (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    UserDetails.getAllUsers()
      .then((users) => res.json(users))
      .catch((err) => next(err));
  }
);

export default router;
