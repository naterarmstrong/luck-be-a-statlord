import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/db';
import User from './user';

export const Run = sequelize.define('Run', {
    number: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    victory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    guillotine: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    // TODO: include total number of spins
    spins: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.INTEGER,
    },
    duration: {
        type: DataTypes.INTEGER
    },
    version: {
        type: DataTypes.STRING,
    },
    earlySyms: {
        type: DataTypes.STRING,
    },
    midSyms: {
        type: DataTypes.STRING,
    },
    lateSyms: {
        type: DataTypes.STRING,
    },
});

User.hasMany(Run);
Run.belongsTo(User);

export const CoinsPerSymbol = sequelize.define('CoinsPerSymbol', {
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

Run.hasMany(CoinsPerSymbol);
CoinsPerSymbol.belongsTo(Run);

export const ShowsPerSymbol = sequelize.define('ShowsPerSymbol', {
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

Run.hasMany(ShowsPerSymbol);
ShowsPerSymbol.belongsTo(Run);

export const Spin = sequelize.define('Spin', {
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    coinsEarned: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalCoins: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

Run.hasMany(Spin);
Spin.belongsTo(Run);

export const SpinSymbol = sequelize.define('SpinSymbol', {
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 19,
        },
        primaryKey: true,
    },
    spin: {
        type: DataTypes.INTEGER,
        references: {
            model: "spins",
            key: "id"
        },
        primaryKey: true,
    }
});