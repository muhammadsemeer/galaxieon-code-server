import { Router, Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/token";
import { RequestWithUser } from "../types/User";
import instaceHandler from "../helpers/instance/handle";

const router: Router = Router();

router.post(
  "/create",
  verifyToken,
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.query.template)
      return next({ status: 400, message: "Template Id Missing" });
    instaceHandler
      .createInstance(req.user.id, req.query.template as string, req.body)
      .then((instance) => {
        res.status(201).json(instance);
      })
      .catch((err) => next(err));
  }
);

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  instaceHandler
    .getInstanceById(req.params.id)
    .then((instance) => res.json(instance))
    .catch((err) => next(err));
});

router.get(
  "/",
  verifyToken,
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    instaceHandler
      .getAllInstances(req.user.id)
      .then((instances) => res.json(instances))
      .catch((err) => next(err));
  }
);

export default router;
