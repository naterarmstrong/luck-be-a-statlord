"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinSymbol = exports.Spin = exports.SymbolDetails = exports.Run = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db/db");
const user_1 = __importDefault(require("./user"));
exports.Run = db_1.sequelize.define('Run', {
    hash: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    number: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    victory: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    guillotine: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    spins: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER
    },
    version: {
        type: sequelize_1.DataTypes.STRING,
    },
    earlySyms: {
        type: sequelize_1.DataTypes.STRING,
    },
    midSyms: {
        type: sequelize_1.DataTypes.STRING,
    },
    lateSyms: {
        type: sequelize_1.DataTypes.STRING,
    },
});
user_1.default.hasMany(exports.Run);
exports.Run.belongsTo(user_1.default);
exports.SymbolDetails = db_1.sequelize.define('SymbolDetails', {
    symbol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    value: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    count: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    RunId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "runs",
            key: "id",
        },
        primaryKey: true
    }
}, {
    timestamps: false
});
exports.Run.hasMany(exports.SymbolDetails);
exports.SymbolDetails.belongsTo(exports.Run);
exports.Spin = db_1.sequelize.define('Spin', {
    // We cannot use a composite primary key on (number, run) because sequelize doesn't really
    // support composite foreign keys. It results in an error when trying to insert
    number: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    coinsEarned: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    totalCoins: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    Symbols: {
        // Comma-separated list of symbols
        type: sequelize_1.DataTypes.STRING(800)
    },
    Values: {
        // Comma-separated list of numbers
        type: sequelize_1.DataTypes.STRING(400)
    },
    Extras: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    timestamps: false
});
exports.Run.hasMany(exports.Spin);
exports.Spin.belongsTo(exports.Run);
// TODO: Seriously consider cutting the spin symbols from the database, and just putting them in a
// blob attached to the spin. I don't think we would ever need to query them for much
exports.SpinSymbol = db_1.sequelize.define('SpinSymbol', {
    symbol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    index: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 19,
        },
        primaryKey: true,
    },
    SpinId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "spins",
            key: "id",
        },
        primaryKey: true,
    }
}, {
    timestamps: false
});
exports.Spin.hasMany(exports.SpinSymbol);
exports.SpinSymbol.belongsTo(exports.Spin);
