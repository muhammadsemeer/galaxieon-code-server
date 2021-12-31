import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import instaceHandler from "../helpers/instance/handle";
import liveReload from "../helpers/instance/livereload";

const router = Router();

router.get("/static/gcode/utils.js", (req: Request, res: Response) => {
  const file = path.resolve(__dirname, "../helpers/preview/dist/main.js");
  res.sendFile(file);
});

router.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subdomain = req.subdomains;
    if (!subdomain[1]) return next();
    let instance = await instaceHandler.getInstanceById(subdomain[1], [
      "id",
      "autopreview",
    ]);
    req.url = req.path === "/" ? "index.html" : req.path;
    let src = path.join(__dirname, "../public/instances", instance.id, req.url);
    let pathArray = req.path.split(".");
    let ext = pathArray[pathArray.length - 1];
    if (ext === "html" && instance.autopreview)
      return res.send(await liveReload(src, instance.id));
    res.sendFile(src);
  } catch (error) {
    next(error);
  }
});

export default router;
