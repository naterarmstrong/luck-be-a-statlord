import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/db';
import { SYMBOL_RARITIES, Symbol } from '../../frontend/src/common/models/symbol'

export const DSymbol = sequelize.define('Symbol', {
    name: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    rarity: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
});

// Initialize the symbols with all necessary values
export async function initializeSymbols() {
    const nSymbols = await DSymbol.count();
    if (nSymbols == 0) {
        await DSymbol.bulkCreate(Object.keys(Symbol).map((v, i, a) => ({ name: v, rarity: SYMBOL_RARITIES[v as Symbol] })));
    }
}
