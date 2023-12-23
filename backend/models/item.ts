import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/db';
import { ITEM_RARITIES, Item } from '../../frontend/src/common/models/item';

export const DItem = sequelize.define('Item', {
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
export async function initializeItems() {
    const nItems = await DItem.count();
    if (nItems == 0) {
        await DItem.bulkCreate(Object.keys(Item).map((v, i, a) => ({ name: v, rarity: ITEM_RARITIES[v as Item] })));
    }
}
