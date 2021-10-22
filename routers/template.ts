import { Router, Response, Request, NextFunction } from "express";
import templateHelper from "../helpers/template/handle";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  templateHelper
    .getTemplates()
    .then((template) => res.json(template))
    .catch((err) => next(err));
});

export default router;
