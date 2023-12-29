export enum Rarity {
    Common = "common",
    Uncommon = "uncommon",
    Rare = "rare",
    VeryRare = "very_rare",
    Special = "special",
    Essence = "essence",
}

export function rarityToString(rarity: Rarity) {
    switch (rarity) {
        case Rarity.Common:
            return "Common"
        case Rarity.Uncommon:
            return "Uncommon"
        case Rarity.Rare:
            return "Rare"
        case Rarity.VeryRare:
            return "Very Rare"
        case Rarity.Special:
            return "Special"
        case Rarity.Essence:
            return "Essence"
        default:
            return "Unknown"
    }
}

export function rarityColor(rarity: Rarity): string {
    switch (rarity) {
        case Rarity.Common:
            return "#797979"
        case Rarity.Uncommon:
            return "#61d3e3"
        case Rarity.Rare:
            return "#fbf236"
        case Rarity.VeryRare:
            return "#7234bf"
        case Rarity.Special:
            return "#e14a68"
        case Rarity.Essence:
            return "#e14a68"
        default:
            return "#e14a68"
    }
}