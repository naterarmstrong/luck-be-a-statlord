import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/db';
import User from './user';

export const Run = sequelize.define('Run', {
    hash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    processedVersion: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
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
    isFloor20: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
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
    majorVersion: {
        type: DataTypes.SMALLINT,
    },
    minorVersion: {
        type: DataTypes.SMALLINT,
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
}, {
    indexes: [
        {
            fields: ['UserId']
        },
        {
            name: 'won_runs_by_user',
            fields: ['UserId'],
            where: {
                isFloor20: true,
                victory: true,
            }
        }
    ]
});

User.hasMany(Run);
Run.belongsTo(User);

export const SymbolDetails = sequelize.define('SymbolDetails', {
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    earliestRentAdded: {
        type: DataTypes.INTEGER,
    },
    addedByChoice: {
        type: DataTypes.INTEGER,
    },
    addedByEffect: {
        type: DataTypes.INTEGER,
    },
    timesRemovedByEffect: {
        type: DataTypes.INTEGER,
    },
    timesDestroyedByEffect: {
        type: DataTypes.INTEGER,
    },
    timesRemovedByPlayer: {
        type: DataTypes.INTEGER,
    },
    RunId: {
        type: DataTypes.INTEGER,
        references: {
            model: "runs",
            key: "id",
        },
        primaryKey: true
    }
}, {
    timestamps: false
});

Run.hasMany(SymbolDetails);
SymbolDetails.belongsTo(Run);

export const ItemDetails = sequelize.define('ItemDetails', {
    item: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    earliestRentAdded: {
        type: DataTypes.INTEGER,
    },
    addedByChoice: {
        type: DataTypes.INTEGER,
    },
    addedByEffect: {
        type: DataTypes.INTEGER,
    },
    timesDestroyed: {
        type: DataTypes.INTEGER,
    },
    RunId: {
        type: DataTypes.INTEGER,
        references: {
            model: "runs",
            key: "id",
        },
        primaryKey: true
    }
}, {
    timestamps: false
});

Run.hasMany(ItemDetails);
ItemDetails.belongsTo(Run);

export const SymbolDetailsByRent = sequelize.define('SymbolDetailsByRent', {
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    rent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timesAdded: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RunId: {
        type: DataTypes.INTEGER,
        references: {
            model: "runs",
            key: "id",
        },
        primaryKey: true
    }
}, {
    timestamps: false
});

Run.hasMany(SymbolDetailsByRent);
SymbolDetailsByRent.belongsTo(Run);

export const ItemDetailsByRent = sequelize.define('ItemDetailsByRent', {
    item: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    rent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    timesDestroyed: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timesAdded: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    RunId: {
        type: DataTypes.INTEGER,
        references: {
            model: "runs",
            key: "id",
        },
        primaryKey: true
    }
}, {
    timestamps: false
});

Run.hasMany(ItemDetailsByRent);
ItemDetailsByRent.belongsTo(Run);

export const Spin = sequelize.define('Spin', {
    // We cannot use a composite primary key on (number, run) because sequelize doesn't really
    // support composite foreign keys. It results in an error when trying to insert
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
    FullSpinData: {
        // The full, json-encoded spin data
        type: DataTypes.STRING(10000)
    }
}, {
    timestamps: false
});

Run.hasMany(Spin);
Spin.belongsTo(Run);