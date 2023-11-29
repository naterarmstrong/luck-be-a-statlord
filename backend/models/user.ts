import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../db/db"

export class User extends Model { }

User.init({
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User'
});