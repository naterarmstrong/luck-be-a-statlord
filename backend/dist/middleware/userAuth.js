"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const checkLogin = (req, res, next) => {
    const token = req.cookies['jwt'];
    console.log(token);
    if (token) {
        const jwtData = jsonwebtoken_1.default.verify(token, index_1.JWT_SECRET);
        if (jwtData.exp > Date.now()) {
            console.log("Expired token");
            return next();
        }
        req.loggedIn = jwtData.username;
        console.log(jwtData);
        console.log(req.loggedIn);
    }
    else {
        console.log("No auth cookie attached to request");
    }
    next();
};
exports.checkLogin = checkLogin;
