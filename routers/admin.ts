import { Router, Request, Response, NextFunction } from "express";
import { verifyAdmin } from "../auth/token";
import { RequestWithAdmin } from "../types/User";

const router: Router = Router();

// Middleware for verfiying admin
router.use(verifyAdmin);


export default router;
