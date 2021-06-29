import { Router, Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/token";
import { RequestWithUser } from "../types/User";
import instaceHandler from "../helpers/instance/handle";

const router: Router = Router();

router.post(
  "/create",
  verifyToken,
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    console.log(req.user);
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

router.get(
  "/deleted",
  verifyToken,
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    instaceHandler
      .getDeletedInstances(req.user.id)
      .then((instances) => res.json(instances))
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

router.get("/code/*", (req: Request, res: Response, next: NextFunction) => {
  let path = Object.values(req.params).toString();
  instaceHandler
    .getCode(path)
    .then((code) => res.json(code))
    .catch((err) => next(err));
});

router.put(
  "/:id",
  verifyToken,
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    instaceHandler
      .updateInstance(req.params.id, req.body)
      .then((updated) => {
        res.json(updated);
      })
      .catch((err) => next(err));
  }
);

router.delete(
  "/:id",
  verifyToken,
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    let date = new Date(
      new Date().setDate(new Date().getDate() + 3)
    ).toDateString();
    instaceHandler
      .deleteInstance(req.params.id, req.user.id)
      .then(() =>
        res.json({ status: "OK", message: `You Can retrive it before ${date}` })
      )
      .catch((err) => next(err));
  }
);

router.get(
  "/retrive/:id",
  verifyToken,
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    instaceHandler
      .retriveInstance(req.params.id, req.user.id)
      .then((instance) => res.json(instance))
      .catch((err) => next(err));
  }
);

router.get(
  "/fork/:id",
  verifyToken,
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    instaceHandler
      .forkInstance(req.params.id, req.user.id)
      .then((instance) => res.json(instance))
      .catch((err) => next(err));
  }
);

export default router;
