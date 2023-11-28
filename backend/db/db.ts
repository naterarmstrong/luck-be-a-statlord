import { Sequelize, Op, Model, DataTypes } from 'sequelize';

export const sequelize = new Sequelize("sqlite::memory");
