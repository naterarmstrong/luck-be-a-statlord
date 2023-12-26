import { Rarity } from "./rarity"

export enum Symbol {
    Amethyst = "Amethyst",
    Anchor = "Anchor",
    Apple = "Apple",
    Banana = "Banana",
    BananaPeel = "BananaPeel",
    BarofSoap = "BarofSoap",
    Bartender = "Bartender",
    Bear = "Bear",
    Beastmaster = "Beastmaster",
    Bee = "Bee",
    Beehive = "Beehive",
    Beer = "Beer",
    BigOre = "BigOre",
    BigUrn = "BigUrn",
    Billionaire = "Billionaire",
    BountyHunter = "BountyHunter",
    BronzeArrow = "BronzeArrow",
    Bubble = "Bubble",
    BuffingCapsule = "BuffingCapsule",
    Candy = "Candy",
    CardShark = "CardShark",
    Cat = "Cat",
    Cheese = "Cheese",
    Chef = "Chef",
    ChemicalSeven = "ChemicalSeven",
    Cherry = "Cherry",
    Chick = "Chick",
    Chicken = "Chicken",
    Clubs = "Clubs",
    Coal = "Coal",
    Coconut = "Coconut",
    CoconutHalf = "CoconutHalf",
    Coin = "Coin",
    Comedian = "Comedian",
    Cow = "Cow",
    Crab = "Crab",
    Crow = "Crow",
    Cultist = "Cultist",
    Dame = "Dame",
    Diamond = "Diamond",
    Diamonds = "Diamonds",
    Diver = "Diver",
    Dog = "Dog",
    Dove = "Dove",
    Dud = "Dud",
    Dwarf = "Dwarf",
    Egg = "Egg",
    EldritchCreature = "EldritchCreature",
    Emerald = "Emerald",
    Empty = "Empty",
    EssenceCapsule = "EssenceCapsule",
    Farmer = "Farmer",
    FiveSidedDie = "FiveSidedDie",
    Flower = "Flower",
    FrozenFossil = "FrozenFossil",
    Gambler = "Gambler",
    GeneralZaroff = "GeneralZaroff",
    Geologist = "Geologist",
    GoldenArrow = "GoldenArrow",
    GoldenEgg = "GoldenEgg",
    Goldfish = "Goldfish",
    Golem = "Golem",
    Goose = "Goose",
    Hearts = "Hearts",
    HexOfDestruction = "HexOfDestruction",
    HexOfDraining = "HexOfDraining",
    HexOfEmptiness = "HexOfEmptiness",
    HexOfHoarding = "HexOfHoarding",
    HexOfMidas = "HexOfMidas",
    HexOfTedium = "HexOfTedium",
    HexOfThievery = "HexOfThievery",
    Highlander = "Highlander",
    Honey = "Honey",
    Hooligan = "Hooligan",
    HustlingCapsule = "HustlingCapsule",
    ItemCapsule = "ItemCapsule",
    Jellyfish = "Jellyfish",
    Joker = "Joker",
    Key = "Key",
    KingMidas = "KingMidas",
    LightBulb = "LightBulb",
    Lockbox = "Lockbox",
    LuckyCapsule = "LuckyCapsule",
    MagicKey = "MagicKey",
    Magpie = "Magpie",
    Martini = "Martini",
    MatryoshkaDoll1 = "MatryoshkaDoll1",
    MatryoshkaDoll2 = "MatryoshkaDoll2",
    MatryoshkaDoll3 = "MatryoshkaDoll3",
    MatryoshkaDoll4 = "MatryoshkaDoll4",
    MatryoshkaDoll5 = "MatryoshkaDoll5",
    MegaChest = "MegaChest",
    MidasBomb = "MidasBomb",
    Milk = "Milk",
    Mine = "Mine",
    Miner = "Miner",
    Monkey = "Monkey",
    Moon = "Moon",
    Mouse = "Mouse",
    MrsFruit = "MrsFruit",
    Ninja = "Ninja",
    Omelette = "Omelette",
    Orange = "Orange",
    Ore = "Ore",
    Owl = "Owl",
    Oyster = "Oyster",
    Peach = "Peach",
    Pear = "Pear",
    Pearl = "Pearl",
    Pirate = "Pirate",
    Pinata = "Pinata",
    Plum = "Plum",
    Present = "Present",
    Pufferfish = "Pufferfish",
    Rabbit = "Rabbit",
    RabbitFluff = "RabbitFluff",
    Rain = "Rain",
    RemovalCapsule = "RemovalCapsule",
    RerollCapsule = "RerollCapsule",
    RobinHood = "RobinHood",
    Ruby = "Ruby",
    Safe = "Safe",
    SandDollar = "SandDollar",
    Sapphire = "Sapphire",
    Seed = "Seed",
    ShinyPebble = "ShinyPebble",
    SilverArrow = "SilverArrow",
    Sloth = "Sloth",
    Snail = "Snail",
    Spades = "Spades",
    Spirit = "Spirit",
    Strawberry = "Strawberry",
    Sun = "Sun",
    Target = "Target",
    TediumCapsule = "TediumCapsule",
    Thief = "Thief",
    ThreeSidedDie = "ThreeSidedDie",
    TimeCapsule = "TimeCapsule",
    Toddler = "Toddler",
    Tomb = "Tomb",
    TreasureChest = "TreasureChest",
    Turtle = "Turtle",
    Urn = "Urn",
    VoidCreature = "VoidCreature",
    VoidFruit = "VoidFruit",
    VoidStone = "VoidStone",
    Watermelon = "Watermelon",
    WealthyCapsule = "WealthyCapsule",
    Wildcard = "Wildcard",
    Wine = "Wine",
    Witch = "Witch",
    Wolf = "Wolf",
    Unknown = "Unknown",
}

export function isSymbol(s: string): boolean {
    return Object.values(Symbol).includes(s as any);
}

export namespace SymbolUtils {
    export function isArrow(s: Symbol) {
        return [Symbol.BronzeArrow, Symbol.SilverArrow, Symbol.GoldenArrow].includes(s);
    }

    export function isEater(s: Symbol) {
        return [Symbol.Geologist, Symbol.Diver, Symbol.MrsFruit, Symbol.EldritchCreature, Symbol.Pirate].includes(s);
    }

    export function isGrower(s: Symbol) {
        return [Symbol.Amethyst, Symbol.Pear, Symbol.Dove].includes(s);
    }
}

export const SYMBOL_RARITIES: Record<Symbol, Rarity> = {
    [Symbol.Amethyst]: Rarity.Rare,
    [Symbol.Anchor]: Rarity.Common,
    [Symbol.Apple]: Rarity.Rare,
    [Symbol.Banana]: Rarity.Common,
    [Symbol.BananaPeel]: Rarity.Common,
    [Symbol.BarofSoap]: Rarity.Uncommon,
    [Symbol.Bartender]: Rarity.Rare,
    [Symbol.Bear]: Rarity.Uncommon,
    [Symbol.Beastmaster]: Rarity.Rare,
    [Symbol.Bee]: Rarity.Common,
    [Symbol.Beehive]: Rarity.Rare,
    [Symbol.Beer]: Rarity.Common,
    [Symbol.BigOre]: Rarity.Uncommon,
    [Symbol.BigUrn]: Rarity.Uncommon,
    [Symbol.Billionaire]: Rarity.Uncommon,
    [Symbol.BountyHunter]: Rarity.Common,
    [Symbol.BronzeArrow]: Rarity.Uncommon,
    [Symbol.Bubble]: Rarity.Common,
    [Symbol.BuffingCapsule]: Rarity.Uncommon,
    [Symbol.Candy]: Rarity.Common,
    [Symbol.CardShark]: Rarity.Rare,
    [Symbol.Cat]: Rarity.Common,
    [Symbol.Cheese]: Rarity.Common,
    [Symbol.Chef]: Rarity.Rare,
    [Symbol.ChemicalSeven]: Rarity.Uncommon,
    [Symbol.Cherry]: Rarity.Common,
    [Symbol.Chick]: Rarity.Uncommon,
    [Symbol.Chicken]: Rarity.Rare,
    [Symbol.Clubs]: Rarity.Uncommon,
    [Symbol.Coal]: Rarity.Common,
    [Symbol.Coconut]: Rarity.Uncommon,
    [Symbol.CoconutHalf]: Rarity.Uncommon,
    [Symbol.Coin]: Rarity.Common,
    [Symbol.Comedian]: Rarity.Rare,
    [Symbol.Cow]: Rarity.Rare,
    [Symbol.Crab]: Rarity.Common,
    [Symbol.Crow]: Rarity.Common,
    [Symbol.Cultist]: Rarity.Common,
    [Symbol.Dame]: Rarity.Rare,
    [Symbol.Diamond]: Rarity.VeryRare,
    [Symbol.Diamonds]: Rarity.Uncommon,
    [Symbol.Diver]: Rarity.Rare,
    [Symbol.Dog]: Rarity.Common,
    [Symbol.Dove]: Rarity.Rare,
    [Symbol.Dud]: Rarity.Special,
    [Symbol.Dwarf]: Rarity.Common,
    [Symbol.Egg]: Rarity.Common,
    [Symbol.EldritchCreature]: Rarity.VeryRare,
    [Symbol.Emerald]: Rarity.Rare,
    [Symbol.Empty]: Rarity.Special,
    [Symbol.EssenceCapsule]: Rarity.Uncommon,
    [Symbol.Farmer]: Rarity.Rare,
    [Symbol.FiveSidedDie]: Rarity.Uncommon,
    [Symbol.Flower]: Rarity.Common,
    [Symbol.FrozenFossil]: Rarity.Rare,
    [Symbol.Gambler]: Rarity.Common,
    [Symbol.GeneralZaroff]: Rarity.Rare,
    [Symbol.Geologist]: Rarity.Rare,
    [Symbol.GoldenArrow]: Rarity.VeryRare,
    [Symbol.GoldenEgg]: Rarity.Rare,
    [Symbol.Goldfish]: Rarity.Common,
    [Symbol.Golem]: Rarity.Uncommon,
    [Symbol.Goose]: Rarity.Common,
    [Symbol.Hearts]: Rarity.Uncommon,
    [Symbol.HexOfDestruction]: Rarity.Uncommon,
    [Symbol.HexOfDraining]: Rarity.Uncommon,
    [Symbol.HexOfEmptiness]: Rarity.Uncommon,
    [Symbol.HexOfHoarding]: Rarity.Uncommon,
    [Symbol.HexOfMidas]: Rarity.Uncommon,
    [Symbol.HexOfTedium]: Rarity.Uncommon,
    [Symbol.HexOfThievery]: Rarity.Uncommon,
    [Symbol.Highlander]: Rarity.VeryRare,
    [Symbol.Honey]: Rarity.Rare,
    [Symbol.Hooligan]: Rarity.Uncommon,
    [Symbol.HustlingCapsule]: Rarity.Uncommon,
    [Symbol.ItemCapsule]: Rarity.Uncommon,
    [Symbol.Jellyfish]: Rarity.Uncommon,
    [Symbol.Joker]: Rarity.Rare,
    [Symbol.Key]: Rarity.Common,
    [Symbol.KingMidas]: Rarity.Rare,
    [Symbol.LightBulb]: Rarity.Common,
    [Symbol.Lockbox]: Rarity.Common,
    [Symbol.LuckyCapsule]: Rarity.Uncommon,
    [Symbol.MagicKey]: Rarity.Rare,
    [Symbol.Magpie]: Rarity.Common,
    [Symbol.Martini]: Rarity.Rare,
    [Symbol.MatryoshkaDoll1]: Rarity.Uncommon,
    // TODO: Should this just be uncommon? After all, the base symbol is uncommon
    [Symbol.MatryoshkaDoll2]: Rarity.Special,
    [Symbol.MatryoshkaDoll3]: Rarity.Special,
    [Symbol.MatryoshkaDoll4]: Rarity.Special,
    [Symbol.MatryoshkaDoll5]: Rarity.Special,
    [Symbol.MegaChest]: Rarity.VeryRare,
    [Symbol.MidasBomb]: Rarity.VeryRare,
    [Symbol.Milk]: Rarity.Common,
    [Symbol.Mine]: Rarity.Rare,
    [Symbol.Miner]: Rarity.Common,
    [Symbol.Monkey]: Rarity.Common,
    [Symbol.Moon]: Rarity.Rare,
    [Symbol.Mouse]: Rarity.Common,
    [Symbol.MrsFruit]: Rarity.Rare,
    [Symbol.Ninja]: Rarity.Uncommon,
    [Symbol.Omelette]: Rarity.Rare,
    [Symbol.Orange]: Rarity.Uncommon,
    [Symbol.Ore]: Rarity.Common,
    [Symbol.Owl]: Rarity.Common,
    [Symbol.Oyster]: Rarity.Common,
    [Symbol.Peach]: Rarity.Uncommon,
    [Symbol.Pear]: Rarity.Rare,
    [Symbol.Pearl]: Rarity.Common,
    [Symbol.Pirate]: Rarity.VeryRare,
    [Symbol.Pinata]: Rarity.Uncommon,
    [Symbol.Plum]: Rarity.Uncommon,
    [Symbol.Present]: Rarity.Common,
    [Symbol.Pufferfish]: Rarity.Uncommon,
    [Symbol.Rabbit]: Rarity.Uncommon,
    [Symbol.RabbitFluff]: Rarity.Uncommon,
    [Symbol.Rain]: Rarity.Uncommon,
    [Symbol.RemovalCapsule]: Rarity.Uncommon,
    [Symbol.RerollCapsule]: Rarity.Uncommon,
    [Symbol.RobinHood]: Rarity.Rare,
    [Symbol.Ruby]: Rarity.Rare,
    [Symbol.Safe]: Rarity.Uncommon,
    [Symbol.SandDollar]: Rarity.Uncommon,
    [Symbol.Sapphire]: Rarity.Uncommon,
    [Symbol.Seed]: Rarity.Common,
    [Symbol.ShinyPebble]: Rarity.Common,
    [Symbol.SilverArrow]: Rarity.Rare,
    [Symbol.Sloth]: Rarity.Uncommon,
    [Symbol.Snail]: Rarity.Common,
    [Symbol.Spades]: Rarity.Uncommon,
    [Symbol.Spirit]: Rarity.Rare,
    [Symbol.Strawberry]: Rarity.Rare,
    [Symbol.Sun]: Rarity.Rare,
    [Symbol.Target]: Rarity.Uncommon,
    [Symbol.TediumCapsule]: Rarity.Uncommon,
    [Symbol.Thief]: Rarity.Uncommon,
    [Symbol.ThreeSidedDie]: Rarity.Common,
    [Symbol.TimeCapsule]: Rarity.Uncommon,
    [Symbol.Toddler]: Rarity.Common,
    [Symbol.Tomb]: Rarity.Rare,
    [Symbol.TreasureChest]: Rarity.Rare,
    [Symbol.Turtle]: Rarity.Common,
    [Symbol.Urn]: Rarity.Common,
    [Symbol.VoidCreature]: Rarity.Uncommon,
    [Symbol.VoidFruit]: Rarity.Uncommon,
    [Symbol.VoidStone]: Rarity.Uncommon,
    [Symbol.Watermelon]: Rarity.VeryRare,
    [Symbol.WealthyCapsule]: Rarity.Uncommon,
    [Symbol.Wildcard]: Rarity.VeryRare,
    [Symbol.Wine]: Rarity.Uncommon,
    [Symbol.Witch]: Rarity.Rare,
    [Symbol.Wolf]: Rarity.Uncommon,
    [Symbol.Unknown]: Rarity.Special,
};

export enum ArrowDirections {
    N = "N",
    NE = "NE",
    E = "E",
    SE = "SE",
    S = "S",
    SW = "SW",
    W = "W",
    NW = "NW",
}