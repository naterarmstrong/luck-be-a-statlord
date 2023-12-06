import { Sequelize, Op, Model, DataTypes } from 'sequelize';
import fs from 'fs';

export const sequelize = new Sequelize("sqlite:./DATA/db.sqlite");


// Static Queries
export const symbolWinratesQuery = fs.readFileSync('db/symbolWinrates.sql').toString();
export const userStatsQuery = fs.readFileSync('db/userStats.sql').toString();