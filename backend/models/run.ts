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

// TODO: Is it better to combine these two into SymbolStats?? And have it per-run? probably..
export const CoinsPerSymbol = sequelize.define('CoinsPerSymbol', {
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    value: {
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

Run.hasMany(CoinsPerSymbol);
CoinsPerSymbol.belongsTo(Run);

export const ShowsPerSymbol = sequelize.define('ShowsPerSymbol', {
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    count: {
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

Run.hasMany(ShowsPerSymbol);
ShowsPerSymbol.belongsTo(Run);

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
    }
}, {
    timestamps: false
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
    SpinId: {
        type: DataTypes.INTEGER,
        references: {
            model: "spins",
            key: "id",
        },
        primaryKey: true,
    }
}, {
    timestamps: false
});

Spin.hasMany(SpinSymbol);
SpinSymbol.belongsTo(Spin);