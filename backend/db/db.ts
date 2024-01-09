import { Sequelize, Op, Model, DataTypes } from 'sequelize';
import fs from 'fs';

export const sequelize = new Sequelize("sqlite:./DATA/db.sqlite");
// export const sequelize = new Sequelize("sqlite::memory");


// Static Queries
export const symbolWinratesQuery = fs.readFileSync('db/symbolWinrates.sql').toString();
export const itemWinratesQuery = fs.readFileSync('db/itemWinrates.sql').toString();
export const essenceWinratesQuery = fs.readFileSync('db/essenceWinrates.sql').toString();

// Parameterized queries
export const userStatsQuery = fs.readFileSync('db/userStats.sql').toString();
export const bestUsersQuery = fs.readFileSync('db/bestUsers.sql').toString();