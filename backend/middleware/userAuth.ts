import { User } from "../models/user";
import { Request, Response, NextFunction } from 'express';

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
    console.log("checkLogin: Cookies", req.cookies);
    console.log("checkLogin: Signed cookies", req.signedCookies);
    next();
}