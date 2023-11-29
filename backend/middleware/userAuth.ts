import { User } from "../models/user";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../index";

type JWTData = {
    username: string,
    exp: number,
}

type HasLogin = {
    loggedIn?: string
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
        (req as AuthorizedRequest).loggedIn = jwtData.username;
        console.log(jwtData);
        console.log((req as AuthorizedRequest).loggedIn);
    } else {
        console.log("No auth cookie attached to request");
    }
    next();
}