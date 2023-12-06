"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStatsQuery = exports.symbolWinratesQuery = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
exports.sequelize = new sequelize_1.Sequelize("sqlite:./DATA/db.sqlite");
// Static Queries
exports.symbolWinratesQuery = fs_1.default.readFileSync('db/symbolWinrates.sql').toString();
exports.userStatsQuery = fs_1.default.readFileSync('db/userStats.sql').toString();
