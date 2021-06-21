import  { Router, Request, Response, NextFunction } from "express";
import instaceHandler from "../helpers/instance/handle";


const router = Router();

router.use(async (req: Request, res: Response, next: NextFunction) => {
  const subdomain = req.subdomains;
  if (!subdomain[1]) return next()
  let instance = await instaceHandler.getInstanceById(subdomain[1]);
  let src = `${instance.id}/${req.path}`;
  req.url = src;
  next();
});

export default router;
