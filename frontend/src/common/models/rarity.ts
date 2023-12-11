export enum Rarity {
    Common = "common",
    Uncommon = "uncommon",
    Rare = "rare",
    VeryRare = "very_rare",
    Special = "special",
    Essence = "essence",
}

export function rarityColor(rarity: Rarity): string {
    switch (rarity) {
        case Rarity.Common:
            return "#ffffff"
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