import { User } from "../models/user";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../index";

type JWTData = {
    id: number,
    username: string,
    exp: number,
}

type HasLogin = {
    userId?: number
    username?: string
};

export type AuthorizedRequest = Request & HasLogin;

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['jwt'];
    console.log(token);
    if (token) {
        const jwtData = jwt.verify(token, JWT_SECRET) as JWTData;
        if (jwtData.exp > Date.now()) {
            console.log("Expired token");
            return next();
        }
        (req as AuthorizedRequest).userId = jwtData.id;
        (req as AuthorizedRequest).username = jwtData.username;
        console.log(jwtData);
    } else {
        console.log("No auth cookie attached to request");
    }
    next();
}