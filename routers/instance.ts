import { Router, Response, NextFunction } from "express";
import { verifyToken } from "../auth/token";
import { RequestWithUser } from "../types/User";
import InstaceHandler from "../helpers/instance/handle";

const router: Router = Router();

router.use(verifyToken);

router.post(
  "/create",
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.query.template)
      return next({ status: 400, message: "Template Id Missing" });
    InstaceHandler.createInstance(req.user.id, req.query.template as string, req.body)
    .then((instance) => {
        res.json(instance)
    }).catch(err => next(err));
  }
);

export default router;
