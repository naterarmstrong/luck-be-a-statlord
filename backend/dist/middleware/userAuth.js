"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLogin = void 0;
const checkLogin = (req, res, next) => {
    console.log("checkLogin: Cookies", req.cookies);
    console.log("checkLogin: Signed cookies", req.signedCookies);
    next();
};
exports.checkLogin = checkLogin;
