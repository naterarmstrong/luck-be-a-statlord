import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../db/db"

export class User extends Model { }

export type UserModel = {
    username: string,
    password: string,
    id: number,
}

// Using this to init includes an implicit ID for the user
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

export default User;