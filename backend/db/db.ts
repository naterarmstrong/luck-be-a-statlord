import { Sequelize, Op, Model, DataTypes } from 'sequelize';
import fs from 'fs';

export const sequelize = new Sequelize("sqlite:./DATA/db.sqlite");


// Static Queries
export const symbolWinratesQuery = fs.readFileSync('db/symbolWinrates.sql').toString();
export const itemWinratesQuery = fs.readFileSync('db/itemWinrates.sql').toString();
export const essenceWinratesQuery = fs.readFileSync('db/essenceWinrates.sql').toString();
export const userStatsQuery = fs.readFileSync('db/userStats.sql').toString();
export const symbolPairsQuery = fs.readFileSync('db/symbolPairs.sql').toString();
export const symbolsApartQuery = fs.readFileSync('db/symbolsApart.sql').toString();