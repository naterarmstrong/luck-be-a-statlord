export const IIDToSymbol = (iid: string): Symbol => {
    return IID_TO_SYMBOL.get(iid) ?? Symbol.Unknown;
}

export enum Rarity {
    Common = "common",
    Uncommon = "uncommon",
    Rare = "rare",
    VeryRare = "very_rare",
    Special = "special",
}

export enum Symbol {
    Amethyst,
    Anchor,
    Apple,
    Banana,
    BananaPeel,
    BarofSoap,
    Bartender,
    Bear,
    Beastmaster,
    Bee,
    Beehive,
    Beer,
    BigOre,
    BigUrn,
    Billionaire,
    BountyHunter,
    BronzeArrow,
    Bubble,
    BuffingCapsule,
    Candy,
    CardShark,
    Cat,
    Cheese,
    Chef,
    ChemicalSeven,
    Cherry,
    Chick,
    Chicken,
    Clubs,
    Coal,
    Coconut,
    CoconutHalf,
    Coin,
    Comedian,
    Cow,
    Crab,
    Crow,
    Cultist,
    Dame,
    Diamond,
    Diamonds,
    Diver,
    Dog,
    Dove,
    Dud,
    Dwarf,
    Egg,
    EldritchCreature,
    Emerald,
    Empty,
    EssenceCapsule,
    Farmer,
    FiveSidedDie,
    Flower,
    FrozenFossil,
    Gambler,
    GeneralZaroff,
    Geologist,
    GoldenArrow,
    GoldenEgg,
    Goldfish,
    Golem,
    Goose,
    Hearts,
    HexOfDestruction,
    HexOfDraining,
    HexOfEmptiness,
    HexOfHoarding,
    HexOfMidas,
    HexOfTedium,
    HexOfThievery,
    Highlander,
    Honey,
    Hooligan,
    HustlingCapsule,
    ItemCapsule,
    Jellyfish,
    Joker,
    Key,
    KingMidas,
    LightBulb,
    Lockbox,
    LuckyCapsule,
    MagicKey,
    Magpie,
    Martini,
    MatryoshkaDoll1,
    MatryoshkaDoll2,
    MatryoshkaDoll3,
    MatryoshkaDoll4,
    MatryoshkaDoll5,
    MegaChest,
    MidasBomb,
    Milk,
    Mine,
    Miner,
    Monkey,
    Moon,
    Mouse,
    MrsFruit,
    Ninja,
    Omelette,
    Orange,
    Ore,
    Owl,
    Oyster,
    Peach,
    Pear,
    Pearl,
    Pirate,
    Pinata,
    Present,
    Pufferfish,
    Rabbit,
    RabbitFluff,
    Rain,
    RemovalCapsule,
    RerollCapsule,
    RobinHood,
    Ruby,
    Safe,
    SandDollar,
    Sapphire,
    Seed,
    ShinyPebble,
    SilverArrow,
    Sloth,
    Snail,
    Spades,
    Spirit,
    Strawberry,
    Sun,
    Target,
    TediumCapsule,
    Thief,
    ThreeSidedDie,
    TimeCapsule,
    Toddler,
    Tomb,
    TreasureChest,
    Turtle,
    Urn,
    VoidCreature,
    VoidFruit,
    VoidStone,
    Watermelon,
    WealthyCapsule,
    Wildcard,
    Wine,
    Witch,
    Wolf,
    Unknown,
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

// Internal ID to symbol mapping
export const IID_TO_SYMBOL: Map<string, Symbol> = new Map([
    ["amethyst", Symbol.Amethyst],
    ["anchor", Symbol.Anchor],
    ["apple", Symbol.Apple],
    ["banana", Symbol.Banana],
    ["banana_peel", Symbol.BananaPeel],
    ["bar_of_soap", Symbol.BarofSoap],
    ["bartender", Symbol.Bartender],
    ["bear", Symbol.Bear],
    ["beastmaster", Symbol.Beastmaster],
    ["bee", Symbol.Bee],
    ["beehive", Symbol.Beehive],
    ["beer", Symbol.Beer],
    ["big_ore", Symbol.BigOre],
    ["big_urn", Symbol.BigUrn],
    ["billionaire", Symbol.Billionaire],
    ["bounty_hunter", Symbol.BountyHunter],
    ["bronze_arrow", Symbol.BronzeArrow],
    ["bubble", Symbol.Bubble],
    ["buffing_powder", Symbol.BuffingCapsule],
    ["candy", Symbol.Candy],
    ["card_shark", Symbol.CardShark],
    ["cat", Symbol.Cat],
    ["cheese", Symbol.Cheese],
    ["chef", Symbol.Chef],
    ["chemical_seven", Symbol.ChemicalSeven],
    ["cherry", Symbol.Cherry],
    ["chick", Symbol.Chick],
    ["chicken", Symbol.Chicken],
    ["clubs", Symbol.Clubs],
    ["coal", Symbol.Coal],
    ["coconut", Symbol.Coconut],
    ["coconut_half", Symbol.CoconutHalf],
    ["coin", Symbol.Coin],
    ["comedian", Symbol.Comedian],
    ["cow", Symbol.Cow],
    ["crab", Symbol.Crab],
    ["crow", Symbol.Crow],
    ["cultist", Symbol.Cultist],
    ["dame", Symbol.Dame],
    ["diamond", Symbol.Diamond],
    ["diamonds", Symbol.Diamonds],
    ["diver", Symbol.Diver],
    ["dog", Symbol.Dog],
    ["dove", Symbol.Dove],
    ["dud", Symbol.Dud],
    ["dwarf", Symbol.Dwarf],
    ["egg", Symbol.Egg],
    ["eldritch_beast", Symbol.EldritchCreature],
    ["emerald", Symbol.Emerald],
    ["empty", Symbol.Empty],
    ["essence_capsule", Symbol.EssenceCapsule],
    ["farmer", Symbol.Farmer],
    ["d5", Symbol.FiveSidedDie],
    ["flower", Symbol.Flower],
    ["frozen_fossil", Symbol.FrozenFossil],
    ["gambler", Symbol.Gambler],
    ["general_zaroff", Symbol.GeneralZaroff],
    ["archaeologist", Symbol.Geologist],
    ["golden_arrow", Symbol.GoldenArrow],
    ["golden_egg", Symbol.GoldenEgg],
    ["goldfish", Symbol.Goldfish],
    ["golem", Symbol.Golem],
    ["goose", Symbol.Goose],
    ["hearts", Symbol.Hearts],
    ["hex_of_destruction", Symbol.HexOfDestruction],
    ["hex_of_draining", Symbol.HexOfDraining],
    ["hex_of_emptiness", Symbol.HexOfEmptiness],
    ["hex_of_hoarding", Symbol.HexOfHoarding],
    ["hex_of_midas", Symbol.HexOfMidas],
    ["hex_of_tedium", Symbol.HexOfTedium],
    ["hex_of_thievery", Symbol.HexOfThievery],
    ["highlander", Symbol.Highlander],
    ["honey", Symbol.Honey],
    ["hooligan", Symbol.Hooligan],
    ["hustler", Symbol.HustlingCapsule],
    ["item_capsule", Symbol.ItemCapsule],
    ["jellyfish", Symbol.Jellyfish],
    ["joker", Symbol.Joker],
    ["key", Symbol.Key],
    ["king_midas", Symbol.KingMidas],
    ["light_bulb", Symbol.LightBulb],
    ["lockbox", Symbol.Lockbox],
    ["lucky_capsule", Symbol.LuckyCapsule],
    ["rarity_capsule", Symbol.LuckyCapsule],
    ["magic_key", Symbol.MagicKey],
    ["magpie", Symbol.Magpie],
    ["martini", Symbol.Martini],
    ["matryoshka_doll_1", Symbol.MatryoshkaDoll1],
    ["matryoshka_doll_2", Symbol.MatryoshkaDoll1],
    ["matryoshka_doll_3", Symbol.MatryoshkaDoll1],
    ["matryoshka_doll_4", Symbol.MatryoshkaDoll1],
    ["matryoshka_doll_5", Symbol.MatryoshkaDoll1],
    ["mega_chest", Symbol.MegaChest],
    ["midas_bomb", Symbol.MidasBomb],
    ["milk", Symbol.Milk],
    ["mine", Symbol.Mine],
    ["miner", Symbol.Miner],
    ["monkey", Symbol.Monkey],
    ["moon", Symbol.Moon],
    ["mouse", Symbol.Mouse],
    ["mrs_fruit", Symbol.MrsFruit],
    ["ninja", Symbol.Ninja],
    ["omelette", Symbol.Omelette],
    ["orange", Symbol.Orange],
    ["ore", Symbol.Ore],
    ["owl", Symbol.Owl],
    ["oyster", Symbol.Oyster],
    ["peach", Symbol.Peach],
    ["pear", Symbol.Pear],
    ["pearl", Symbol.Pearl],
    ["pirate", Symbol.Pirate],
    // I will keep the special character out of code for now
    ["piñata", Symbol.Pinata],
    ["pinata", Symbol.Pinata],
    ["present", Symbol.Present],
    ["pufferfish", Symbol.Pufferfish],
    ["rabbit", Symbol.Rabbit],
    ["rabbit_fluff", Symbol.RabbitFluff],
    ["rain", Symbol.Rain],
    ["removal_capsule", Symbol.RemovalCapsule],
    ["reroll_capsule", Symbol.RerollCapsule],
    ["robin_hood", Symbol.RobinHood],
    ["ruby", Symbol.Ruby],
    ["safe", Symbol.Safe],
    ["sand_dollar", Symbol.SandDollar],
    ["sapphire", Symbol.Sapphire],
    ["seed", Symbol.Seed],
    ["shiny_pebble", Symbol.ShinyPebble],
    ["silver_arrow", Symbol.SilverArrow],
    ["sloth", Symbol.Sloth],
    ["snail", Symbol.Snail],
    ["spades", Symbol.Spades],
    ["spirit", Symbol.Spirit],
    ["strawberry", Symbol.Strawberry],
    ["sun", Symbol.Sun],
    ["target", Symbol.Target],
    ["tedium_capsule", Symbol.TediumCapsule],
    ["thief", Symbol.Thief],
    ["d3", Symbol.ThreeSidedDie],
    ["time_capsule", Symbol.TimeCapsule],
    ["toddler", Symbol.Toddler],
    ["tomb", Symbol.Tomb],
    ["treasure_chest", Symbol.TreasureChest],
    ["turtle", Symbol.Turtle],
    ["urn", Symbol.Urn],
    ["void_creature", Symbol.VoidCreature],
    ["void_fruit", Symbol.VoidFruit],
    ["void_stone", Symbol.VoidStone],
    ["watermelon", Symbol.Watermelon],
    ["wealthy_capsule", Symbol.WealthyCapsule],
    ["wildcard", Symbol.Wildcard],
    ["wine", Symbol.Wine],
    ["witch", Symbol.Witch],
    ["wolf", Symbol.Wolf],
])

// export const SYMBOL_IMAGES: Record<Symbol, string> = {
// TODO: grab images
// }


/*
"Amethyst", Rarity.Rare, 1, 0, 4, 1, "amethyst.png", "NEW_ACHIEVEMENT_4_12", "Increase an Amethyst's value 20 or more times before rent payment #12 is due."),
"Anchor", Rarity.Common, 1, 0, 2, 0, "anchor.png", "NEW_ACHIEVEMENT_2_1", "Have a Diver and Pirate share an Anchor."),
"Apple", Rarity.Rare, 3, 0, 6, 2, "apple.png", "NEW_ACHIEVEMENT_2_16", "Have 2 Seeds grow into 2 Apples during a spin."),
"Banana", Rarity.Common, 1, 1, 6, 3, "banana.png", "NEW_ACHIEVEMENT_2_4", "Have a Banana add a Banana Peel that destroys a Thief during a spin."),
"Banana Peel", Rarity.Common, 1, 1, 2, 1, "banana_peel.png", "NEW_ACHIEVEMENT_2_5", "Have a Banana Peel destroy 2 or more Thieves during a spin."),
"Bar of Soap", Rarity.Uncommon, 1, 1, 0, 0, "bar_of_soap.png", "NEW_ACHIEVEMENT_6_1", "Have a Bar of Soap add 4 or more Bubbles before being destroyed."),
"Bartender", Rarity.Rare, 3, 4, 2, 5, "bartender.png", "NEW_ACHIEVEMENT_6_9", "Have a Bartender add a Martini."),
"Bear", Rarity.Uncommon, 2, 2, 1, 6, "bear.png", "NEW_ACHIEVEMENT_2_2", "Have 3 or more Bears destroy the same Honey."),
"Beastmaster", Rarity.Rare, 2, 27, 2, 3, "beastmaster.png", "NEW_ACHIEVEMENT_2_9", "Have a Beastmaster increase the value of 5 or more symbols during a spin."),
"Bee", Rarity.Common, 1, 6, 1, 2, "bee.png", "NEW_ACHIEVEMENT_2_10", "Have a Bee give 6 or more coins."),
"Beehive", Rarity.Rare, 3, 1, 2, 1, "beehive.png", "NEW_ACHIEVEMENT_7_5", "Have a Beehive add a Honey that is destroyed by a Bear during the same spin."),
"Beer", Rarity.Common, 1, 0, 4, 3, "beer.png", "NEW_ACHIEVEMENT_2_30", "Have a Dwarf and a Pirate share a Beer."),
"Big Ore", Rarity.Uncommon, 2, 8, 3, 4, "big_ore.png", "NEW_ACHIEVEMENT_2_13", "Have a Big Ore add 2 Rare symbols (without the help of X-ray Machine)."),
"Big Urn", Rarity.Uncommon, 2, 1, 2, 2, "big_urn.png", "NEW_ACHIEVEMENT_2_14", "Destroy 2 or more Big Urns during a spin."),
"Billionaire", Rarity.Uncommon, 0, 2, 3, 5, "billionaire.png", "NEW_ACHIEVEMENT_3_27", "Guillotine 500 Billionaires across all games."),
"Bounty Hunter", Rarity.Common, 1, 2, 2, 5, "bounty_hunter.png", "NEW_ACHIEVEMENT_2_8", "Have a Bounty Hunter destroy 2 or more Thieves during a spin."),
"Bronze Arrow", Rarity.Uncommon, 0, 1, 1, 1, "bronze_arrow.png", "NEW_ACHIEVEMENT_2_18", "Have 3 or more Bronze Arrows point to 0 symbols during a spin.", ["bronze"]),
"Bubble", Rarity.Common, 2, 0, 5, 0, "bubble.png", "NEW_ACHIEVEMENT_2_19", "Have 3 or more Bubbles be destroyed during a spin."),
"Buffing Capsule", Rarity.Uncommon, 0, 0, 0, 1, "buffing_powder.png", "NEW_ACHIEVEMENT_5_13", "Have a Buffing Capsule adjacent to 2 or more Amethysts or Pears during a spin."),
"Candy", Rarity.Common, 1, 0, 4, 2, "candy.png", "NEW_ACHIEVEMENT_4_18", "Have 8 or more Candy."),
"Card Shark", Rarity.Rare, 3, 5, 2, 3, "card_shark.png", "NEW_ACHIEVEMENT_2_22", "Have a Card Shark make 5 or more symbols Wildcards during a spin."),
"Cat", Rarity.Common, 1, 2, 2, 15, "cat.png", "NEW_ACHIEVEMENT_4_26", "Have a Cat give 999,999,999 coins or more."),
"Cheese", Rarity.Common, 1, 0, 7, 2, "cheese.png", "NEW_ACHIEVEMENT_2_24", "Have a Cheese adjacent to Milk, Omelette, and Egg during a spin."),
"Chef", Rarity.Rare, 2, 21, 2, 3, "chef.png", "NEW_ACHIEVEMENT_7_6", "Have a Chef increase the value of 5 or more symbols during a spin."),
"Chemical Seven", Rarity.Uncommon, 0, 0, 2, 4, "chemical_seven.png", "NEW_ACHIEVEMENT_2_26", "Destroy 3 or more Chemical Sevens during a spin.", ["chemical 7"]),
"Cherry", Rarity.Common, 1, 0, 4, 2, "cherry.png", "NEW_ACHIEVEMENT_3_0", "Have 3 or more Cherries adjacent to each other."),
"Chick", Rarity.Uncommon, 1, 1, 3, 4, "chick.png", "NEW_ACHIEVEMENT_2_28", "Have a Chick not grow into a Chicken for 12 or more spins."),
"Chicken", Rarity.Rare, 2, 2, 3, 6, "chicken.png", "NEW_ACHIEVEMENT_2_29", "Have a Chicken add an Egg and Golden Egg during a spin."),
"Clubs", Rarity.Uncommon, 1, 6, 8, 4, "clubs.png", "NEW_ACHIEVEMENT_2_6", "Have 5 or more Clubs."),
"Coal", Rarity.Common, 0, 1, 0, 1, "coal.png", "NEW_ACHIEVEMENT_2_31", "Have 2 Coal transform into a Diamond before rent payment #4 is due (without the help of Time Machine Essence)."),
"Coconut", Rarity.Uncommon, 1, 1, 4, 1, "coconut.png", "NEW_ACHIEVEMENT_2_27", "Have a Monkey destroy a Coconut and destroy 2 Coconut Halves during a spin."),
"Coconut Half", Rarity.Uncommon, 2, 0, 4, 2, "coconut_half.png", "NEW_ACHIEVEMENT_5_15", "Have Mrs. Fruit and a Monkey share a Coconut Half."),
"Coin", Rarity.Common, 1, 0, 3, 2, "coin.png", "NEW_ACHIEVEMENT_3_2", "Have a Coin give 20 or more coins."),
"Comedian", Rarity.Rare, 3, 6, 2, 5, "comedian.png", "NEW_ACHIEVEMENT_3_3", "Have a Comedian be destroyed by General Zaroff."),
"Cow", Rarity.Rare, 3, 1, 2, 3, "cow.png", "NEW_ACHIEVEMENT_3_4", "Have a Cow add a Milk that is destroyed by a Cat during the same spin."),
"Crab", Rarity.Common, 1, 1, 3, 2, "crab.png", "NEW_ACHIEVEMENT_4_8", "Have 5 Crabs in a row."),
"Crow", Rarity.Common, 2, 0, 2, 3, "crow.png", "NEW_ACHIEVEMENT_3_7", "Remove a Crow 1 spin before it would give -3 coins."),
"Cultist", Rarity.Common, 0, 2, 7, 4, "cultist.png", "NEW_ACHIEVEMENT_3_8", "Have 6 or more Cultists."),
"Dame", Rarity.Rare, 2, 10, 2, 3, "dame.png", "NEW_ACHIEVEMENT_3_11", "Have a Dame destroy a Martini while adjacent to a Diamond."),
"Diamond", Rarity.VeryRare, 5, 1, 6, 1, "diamond.png", "NEW_ACHIEVEMENT_3_12", "Have 5 or more Diamonds."),
"Diamonds", Rarity.Uncommon, 1, 6, 8, 4, "diamonds.png", "NEW_ACHIEVEMENT_3_13", "Have 5 or more Diamonds (not the gem)."),
"Diver", Rarity.Rare, 2, 10, 2, 3, "diver.png", "NEW_ACHIEVEMENT_4_1", "Have a Diver remove 20 or more symbols before rent payment #12 is due."),
"Dog", Rarity.Common, 1, 25, 2, 3, "dog.png", "NEW_ACHIEVEMENT_3_15", "Pet the Dog for 1 minute or more."),
"Dove", Rarity.Rare, 2, 0, 1, 3, "dove.png", "NEW_ACHIEVEMENT_3_16", "Have a Dove prevent 20 or more destructions before rent payment #12 is due."),
"Dud", Rarity.Special, 0, 0, 0, 0, "dud.png"),
"Dwarf", Rarity.Common, 1, 2, 2, 5, "dwarf.png", "NEW_ACHIEVEMENT_3_17", "Have a Dwarf destroy a symbol that has its value increased afterwards."),
"Egg", Rarity.Common, 1, 1, 11, 8, "egg.png", "NEW_ACHIEVEMENT_6_21", "Have an Egg transform into a Chick, grow into a Chicken, and lay an Egg during a spin."),
"Eldritch Creature", Rarity.VeryRare, 4, 18, 3, 2, "eldritch_beast.png", "NEW_ACHIEVEMENT_3_19", "Add a symbol then immediately remove it to increase the value of an Eldritch Creature.", ["eldritch"]),
"Emerald", Rarity.Rare, 3, 1, 5, 1, "emerald.png", "NEW_ACHIEVEMENT_3_20", "Add 2 or more Emeralds during a spin."),
"Empty", Rarity.Special, 0, 0, 6, 8, "empty_border.png"),
"Essence Capsule", Rarity.Uncommon, -12, 0, 0, 1, "essence_capsule.png", "NEW_ACHIEVEMENT_3_21", "Lose the game during a spin where an Essence Capsule is destroyed."),
"Farmer", Rarity.Rare, 2, 20, 2, 3, "farmer.png", "NEW_ACHIEVEMENT_3_23", "Have a Farmer adjacent to a Seed that grows into a Rare symbol."),
"Five-Sided Die", Rarity.Uncommon, 0, 0, 1, 3, "d5.png", "NEW_ACHIEVEMENT_3_10", "Have a Five-Sided Die destroy 2 or more Gamblers during a spin.", ["5 sided die", "d5"]),
"Flower", Rarity.Common, 1, 0, 6, 0, "flower.png", "NEW_ACHIEVEMENT_3_24", "Have a Flower give 19,073,486,328,125 or more coins."),
"Frozen Fossil", Rarity.Rare, 0, 10, 0, 1, "frozen_fossil.png", "NEW_ACHIEVEMENT_3_25", "Remove a symbol to make a Frozen Fossil be destroyed faster.", ["fossil"]),
"Gambler", Rarity.Common, 1, 2, 2, 5, "gambler.png", "NEW_ACHIEVEMENT_3_26", "Have a Gambler give 200 or more coins when destroyed before rent payment #12 is due."),
"General Zaroff", Rarity.Rare, 1, 26, 2, 3, "general_zaroff.png", "NEW_ACHIEVEMENT_2_15", "Have General Zaroff destroy 1924 humans across all games.", ["zaroff"]),
"Geologist", Rarity.Rare, 2, 5, 2, 3, "archaeologist.png", "NEW_ACHIEVEMENT_5_29", "Have a Geologist destroy 20 or more symbols before rent payment #12 is due.", ["archaeologist"]),
"Golden Arrow", Rarity.VeryRare, 0, 1, 1, 1, "golden_arrow.png", "NEW_ACHIEVEMENT_3_28", "Have 3 or more Golden Arrows point to 0 symbols during a spin.", ["gold", "golden"]),
"Golden Egg", Rarity.Rare, 4, 0, 5, 3, "golden_egg.png", "NEW_ACHIEVEMENT_3_29", "Have a Golden Egg adjacent to an Egg.", ["gold egg"]),
"Goldfish", Rarity.Common, 1, 2, 2, 4, "goldfish.png", "NEW_ACHIEVEMENT_3_30", "Have a Goldfish and Toddler share a Bubble."),
"Golem", Rarity.Uncommon, 0, 1, 0, 2, "golem.png", "NEW_ACHIEVEMENT_3_31", "Have a Golem add a Spirit."),
"Goose", Rarity.Common, 1, 1, 1, 4, "goose.png", "NEW_ACHIEVEMENT_4_0", "Have a Goose lay a Golden Egg before rent payment #1 is due."),
"Hearts", Rarity.Uncommon, 1, 6, 8, 4, "hearts.png", "NEW_ACHIEVEMENT_4_2", "Have 5 or more Hearts."),
"Hex of Destruction", Rarity.Uncommon, 3, 0, 4, 2, "hex_of_destruction.png", "NEW_ACHIEVEMENT_4_14", "Have a Hex of Destruction trigger 3 spins in a row.", ["destruction"]),
"Hex of Draining", Rarity.Uncommon, 3, 0, 4, 2, "hex_of_draining.png", "NEW_ACHIEVEMENT_2_23", "Have a Hex of Draining increase the value of a symbol.", ["draining"]),
"Hex of Emptiness", Rarity.Uncommon, 3, 0, 4, 2, "hex_of_emptiness.png", "NEW_ACHIEVEMENT_4_5", "Have a Hex of Emptiness trigger 3 spins in a row.", ["emptiness"]),
"Hex of Hoarding", Rarity.Uncommon, 3, 0, 4, 2, "hex_of_hoarding.png", "NEW_ACHIEVEMENT_5_8", "Have a Hex of Hoarding trigger 3 spins in a row.", ["hoarding"]),
"Hex of Midas", Rarity.Uncommon, 3, 1, 4, 3, "hex_of_midas.png", "NEW_ACHIEVEMENT_4_7", "Have a Hex of Midas trigger 3 spins in a row.", ["midas"]),
"Hex of Tedium", Rarity.Uncommon, 3, 0, 4, 2, "hex_of_tedium.png", "NEW_ACHIEVEMENT_3_5", "Add a Hex of Tedium from the choice after destroying a Tedium Capsule.", ["tedium"]),
"Hex of Thievery", Rarity.Uncommon, 3, 0, 4, 2, "hex_of_thievery.png", "NEW_ACHIEVEMENT_4_9", "Have a Hex of Thievery trigger 3 spins in a row.", ["thievery"]),
"Highlander", Rarity.VeryRare, 6, 1, 1, 0, "highlander.png", "NEW_ACHIEVEMENT_7_13", "Add 10 tooltips from the same Highlander."),
"Honey", Rarity.Rare, 3, 0, 6, 1, "honey.png", "NEW_ACHIEVEMENT_4_11", "Have a Honey give 20 or more coins."),
"Hooligan", Rarity.Uncommon, 2, 6, 2, 3, "hooligan.png", "NEW_ACHIEVEMENT_2_0", "Have a Hooligan destroy 3 or more symbols during a spin."), //HOOLIGAN SWEEP!!!
"Hustling Capsule", Rarity.Uncommon, -7, 0, 0, 1, "hustler.png", "NEW_ACHIEVEMENT_4_13", "Lose the game during a spin where a Hustling Capsule is destroyed."),
"Item Capsule", Rarity.Uncommon, 0, 0, 0, 1, "item_capsule.png", "NEW_ACHIEVEMENT_4_3", "Have an Item Capsule add a Pool Ball."),
"Jellyfish", Rarity.Uncommon, 2, 0, 2, 2, "jellyfish.png", "NEW_ACHIEVEMENT_4_15", "Remove a Jellyfish with a Removal Token."),
"Joker", Rarity.Rare, 3, 4, 3, 3, "joker.png", "NEW_ACHIEVEMENT_3_6", "Have a Joker increase the value of 5 or more symbols during a spin."),
"Key", Rarity.Common, 1, 4, 6, 1, "key.png", "NEW_ACHIEVEMENT_4_17", "Have a Key destroy 2 or more symbols during a spin."),
"King Midas", Rarity.Rare, 1, 2, 2, 3, "king_midas.png", "NEW_ACHIEVEMENT_3_14", "Have King Midas adjacent to a Golden Egg."),
"Light Bulb", Rarity.Common, 1, 8, 0, 0, "light_bulb.png", "NEW_ACHIEVEMENT_7_2", "Have a Light Bulb increase the value of 5 or more symbols during a spin."),
"Lockbox", Rarity.Common, 1, 0, 3, 3, "lockbox.png", "NEW_ACHIEVEMENT_4_21", "Destroy 5 Lockboxes before rent payment #12 is due."),
"Lucky Capsule", Rarity.Uncommon, 0, 0, 0, 1, "rarity_capsule.png", "NEW_ACHIEVEMENT_5_20", "Add a Common symbol from the choice after destroying a Lucky Capsule."),
"Magic Key", Rarity.Rare, 2, 4, 0, 0, "magic_key.png", "NEW_ACHIEVEMENT_4_23", "Have a Magic Key increase the value of a symbol that is destroyed by a Key."),
"Magpie", Rarity.Common, -1, 0, 1, 4, "magpie.png", "NEW_ACHIEVEMENT_4_4", "Be 1 coin short of affording rent during a spin where a Magpie gives less than 0 coins."),
"Martini", Rarity.Rare, 3, 0, 4, 2, "martini.png", "NEW_ACHIEVEMENT_4_25", "Have a Martini be destroyed while adjacent to a Dwarf."),
"Matryoshka Doll", Rarity.Uncommon, 0, 1, 0, 1, "matryoshka_doll_1.png", "NEW_ACHIEVEMENT_4_24", "Destroy a Matryoshka Doll before it destroys itself.", ["matryoshka doll 1"]),
"Matryoshka Doll", Rarity.Special, 1, 1, 1, 1, "matryoshka_doll_2.png", undefined, undefined, ["matryoshka doll 2"]),
"Matryoshka Doll", Rarity.Special, 2, 1, 1, 1, "matryoshka_doll_3.png", undefined, undefined, ["matryoshka doll 3"]),
"Matryoshka Doll", Rarity.Special, 3, 1, 1, 1, "matryoshka_doll_4.png", undefined, undefined, ["matryoshka doll 4"]),
"Matryoshka Doll", Rarity.Special, 4, 0, 1, 0, "matryoshka_doll_5.png", undefined, undefined, ["matryoshka doll 5"]),
"Mega Chest", Rarity.VeryRare, 3, 0, 3, 3, "mega_chest.png", "NEW_ACHIEVEMENT_4_27", "Destroy 2 Mega Chests before rent payment #12 is due."),
"Midas Bomb", Rarity.VeryRare, 0, 0, 0, 0, "midas_bomb.png", "NEW_ACHIEVEMENT_4_28", "Have a Midas Bomb destroy more than 18 symbols during a spin."),
"Milk", Rarity.Common, 1, 0, 6, 2, "milk.png", "NEW_ACHIEVEMENT_4_29", "Have 2 or more Cats share a Milk."),
"Mine", Rarity.Rare, 4, 1, 0, 0, "mine.png", "NEW_ACHIEVEMENT_4_30", "Have 2 or more Mining Picks before rent payment #12 is due."),
"Miner", Rarity.Common, 1, 4, 2, 3, "miner.png", "NEW_ACHIEVEMENT_4_31", "Have a Beer be destroyed while adjacent to a Miner."),
"Monkey", Rarity.Common, 1, 3, 2, 3, "monkey.png", "NEW_ACHIEVEMENT_5_0", "Have a Monkey destroy a symbol that has its value increased afterwards."),
"Moon", Rarity.Rare, 3, 4, 0, 1, "moon.png", "NEW_ACHIEVEMENT_5_1", "Destroy a Moon."),
"Mouse", Rarity.Common, 1, 2, 1, 3, "mouse.png", "NEW_ACHIEVEMENT_6_10", "Have a Mouse destroy a Cheese while adjacent to a Ninja."),
"Mrs. Fruit", Rarity.Rare, 2, 6, 2, 3, "mrs_fruit.png", "NEW_ACHIEVEMENT_5_3", "Have Mrs. Fruit destroy 20 or more symbols before rent payment #12 is due.", ["ms fruit"]),
"Ninja", Rarity.Uncommon, 2, 1, 3, 6, "ninja.png", "NEW_ACHIEVEMENT_5_4", "Have a Ninja in your inventory but not appear for 3 spins in a row."),
"Omelette", Rarity.Rare, 3, 5, 2, 3, "omelette.png", "NEW_ACHIEVEMENT_7_7", "Have an Omelette give 20 or more coins."),
"Orange", Rarity.Uncommon, 2, 0, 5, 2, "orange.png", "NEW_ACHIEVEMENT_5_6", ),
"Ore", Rarity.Common, 1, 8, 5, 4, "ore.png", "NEW_ACHIEVEMENT_5_7", "Have an Ore add a Diamond (without the help of X-ray Machine Essence)."),
"Owl", Rarity.Common, 1, 0, 3, 4, "owl.png", "NEW_ACHIEVEMENT_4_6", "Have an Owl give 12 or more coins."),
"Oyster", Rarity.Common, 1, 2, 2, 3, "oyster.png", "NEW_ACHIEVEMENT_5_9", "Have an Oyster add 2 Pearls during a spin."),
"Peach", Rarity.Uncommon, 2, 1, 4, 2, "peach.png", "NEW_ACHIEVEMENT_5_10", "Have Mrs. Fruit destroy a Peach that adds a Seed that grows into a Peach."),
"Pear", Rarity.Rare, 1, 0, 3, 2, "pear.png", "NEW_ACHIEVEMENT_5_11", "Increase a Pear's value 20 or more times before rent payment #12 is due."),
"Pearl", Rarity.Common, 1, 0, 8, 1, "pearl.png", "NEW_ACHIEVEMENT_5_12", "Have a Diver and a Geologist share a Pearl."),
"Pirate", Rarity.VeryRare, 2, 8, 2, 3, "pirate.png", "NEW_ACHIEVEMENT_5_14", "Have a Pirate destroy 20 or more symbols before rent payment #12 is due."),
"Piñata", Rarity.Uncommon, 1, 1, 2, 0, "pinata.png", "NEW_ACHIEVEMENT_5_5", "Destroy a Piñata before rent payment #2 is due."),
"Present", Rarity.Common, 0, 0, 2, 3, "present.png", "NEW_ACHIEVEMENT_3_1", "Have a Present be destroyed 1 spin before the holidays."),
"Pufferfish", Rarity.Uncommon, 2, 0, 2, 2, "pufferfish.png", "NEW_ACHIEVEMENT_5_16", "Have a Pufferfish adjacent to a Bubble that is destroyed during a spin."),
"Rabbit", Rarity.Uncommon, 1, 0, 2, 9, "rabbit.png", "NEW_ACHIEVEMENT_6_18", "Have Rabbits do 1,000 binkies across all games."),
"Rabbit Fluff", Rarity.Uncommon, 2, 0, 0, 6, "rabbit_fluff.png", "NEW_ACHIEVEMENT_7_20", "Shed 3 pounds (1.37kg) of Rabbit Fluff across all games."),
"Rain", Rarity.Uncommon, 2, 2, 0, 1, "rain.png", "NEW_ACHIEVEMENT_5_19", "Have a Rain adjacent to a Seed that grows into a Flower."),
"Removal Capsule", Rarity.Uncommon, 0, 0, 0, 1, "removal_capsule.png", "NEW_ACHIEVEMENT_5_21", "Have a Removal Capsule not be destroyed 3 or more spins after adding it."),
"Reroll Capsule", Rarity.Uncommon, 0, 0, 0, 1, "reroll_capsule.png", "NEW_ACHIEVEMENT_5_22", "Have a Reroll Capsule not be destroyed 3 or more spins after adding it."),
"Robin Hood", Rarity.Rare, -4, 10, 2, 4, "robin_hood.png", "NEW_ACHIEVEMENT_5_26", "Have Robin Hood destroy an Apple while it's directly above a Toddler."),
"Ruby", Rarity.Rare, 3, 1, 5, 1, "ruby.png", "NEW_ACHIEVEMENT_5_24", "Add 2 or more Rubies during a spin."),
"Safe", Rarity.Uncommon, 1, 0, 3, 3, "safe.png", "NEW_ACHIEVEMENT_5_25", "Destroy 4 Safes before rent payment #12 is due."),
"Sand Dollar", Rarity.Uncommon, 2, 0, 2, 2, "sand_dollar.png", "NEW_ACHIEVEMENT_5_23", "Have a Sand Dollar give 40 or more coins when removed with a Removal Token."),
"Sapphire", Rarity.Uncommon, 2, 0, 5, 1, "sapphire.png", "NEW_ACHIEVEMENT_5_27", "Have a Big Ore add 2 Sapphires during a spin."),
"Seed", Rarity.Common, 1, 11, 5, 6, "seed.png", "NEW_ACHIEVEMENT_5_28", "Have a Seed grow into a Watermelon (without the help of Fertilizer Essence)."),
"Shiny Pebble", Rarity.Common, 1, 0, 5, 2, "shiny_pebble.png", "NEW_ACHIEVEMENT_2_3", "Have a Big Ore add 2 Shiny Pebbles during a spin."),
"Silver Arrow", Rarity.Rare, 0, 1, 1, 1, "silver_arrow.png", "NEW_ACHIEVEMENT_5_31", "Have 3 or more Silver Arrows point to 0 symbols during a spin.", ["silver"]),
"Sloth", Rarity.Uncommon, 0, 0, 1, 3, "sloth.png", "NEW_ACHIEVEMENT_5_30", "Have a Sloth adjacent to a Snail and Turtle."),
"Snail", Rarity.Common, 0, 0, 2, 3, "snail.png", "NEW_ACHIEVEMENT_6_0", "Have a Snail give 20 coins or more."),
"Spades", Rarity.Uncommon, 1, 6, 8, 4, "spades.png", "NEW_ACHIEVEMENT_2_12", "Have 5 or more Spades."),
"Spirit", Rarity.Rare, 6, 0, 5, 3, "spirit.png", "NEW_ACHIEVEMENT_6_2", "Have 10 or more Spirits."),
"Strawberry", Rarity.Rare, 3, 1, 4, 2, "strawberry.png", "NEW_ACHIEVEMENT_6_3", "Have 2 Seeds grow into 2 Strawberries during a spin."),
"Sun", Rarity.Rare, 3, 2, 0, 1, "sun.png", "NEW_ACHIEVEMENT_6_4", "Have 3 or more Suns adjacent to the same Flower."),
"Target", Rarity.Uncommon, 2, 0, 5, 2, "target.png", "NEW_ACHIEVEMENT_6_5", "Have a Target be destroyed by a symbol that isn't adjacent to it."),
"Tedium Capsule", Rarity.Uncommon, 0, 0, 0, 3, "tedium_capsule.png", "NEW_ACHIEVEMENT_6_6", "Have a Tedium Capsule and Lucky Capsule be destroyed during a spin."),
"Thief", Rarity.Uncommon, -1, 0, 6, 6, "thief.png", "NEW_ACHIEVEMENT_6_7", "Have a Thief give 500 or more coins when destroyed before rent payment #12 is due."),
"Three-Sided Die", Rarity.Common, 0, 0, 1, 3, "d3.png", "NEW_ACHIEVEMENT_3_9", "Have a Three-Sided Die destroy 2 or more Gamblers during a spin.", ["3 sided die, d3"]),
"Time Capsule", Rarity.Uncommon, 0, 1, 1, 1, "time_capsule.png", "NEW_ACHIEVEMENT_6_8", "Have a Time Capsule add a different capsule."),
"Toddler", Rarity.Common, 1, 8, 3, 4, "toddler.png", "NEW_ACHIEVEMENT_2_7", "Have a Toddler destroy 6 or more symbols during a spin."),
"Tomb", Rarity.Rare, 3, 2, 2, 3, "tomb.png", "NEW_ACHIEVEMENT_5_2", "Have a Tomb add 5 or more Spirits during a spin (without the help of Grave Robber Essence)."),
"Treasure Chest", Rarity.Rare, 2, 0, 3, 4, "treasure_chest.png", "NEW_ACHIEVEMENT_5_17", "Destroy 3 Treasure Chests before rent payment #12 is due."),
"Turtle", Rarity.Common, 0, 0, 2, 4, "turtle.png", "NEW_ACHIEVEMENT_6_12", "Have a Turtle appear in the leftmost column during a spin, then appear in the rightmost column during the next spin."),
"Urn", Rarity.Common, 1, 1, 2, 2, "urn.png", "NEW_ACHIEVEMENT_6_13", "Destroy 2 or more Urns during a spin."),
"Void Creature", Rarity.Uncommon, 0, 2, 1, 6, "void_creature.png", "NEW_ACHIEVEMENT_6_14", "Have a Beastmaster adjacent to a Void Creature that adds a Spirit."),
"Void Fruit", Rarity.Uncommon, 0, 2, 3, 6, "void_fruit.png", "NEW_ACHIEVEMENT_6_15", "Have a Seed grow into a Void Fruit that isn't destroyed during the same spin."),
"Void Stone", Rarity.Uncommon, 0, 2, 4, 6, "void_stone.png", "NEW_ACHIEVEMENT_6_16", "Have a Void Stone give 50 coins or more."),
"Watermelon", Rarity.VeryRare, 4, 1, 4, 2, "watermelon.png", "NEW_ACHIEVEMENT_6_17", "Have 5 or more Watermelons."),
"Wealthy Capsule", Rarity.Uncommon, 0, 0, 0, 3, "lucky_capsule.png", "NEW_ACHIEVEMENT_4_22", "Have a Wealthy Capsule not be destroyed 3 or more spins after adding it."),
"Wildcard", Rarity.VeryRare, 0, 0, 1, 1, "wildcard.png", "NEW_ACHIEVEMENT_7_19", "Have 3 Wildcards each give 1,000,000 coins or more."),
"Wine", Rarity.Uncommon, 2, 0, 4, 3, "wine.png", "NEW_ACHIEVEMENT_6_19", "Have 50 gallons (189.3 litres) of Beer and Wine be consumed."),
"Witch", Rarity.Rare, 2, 13, 5, 4, "witch.png", "NEW_ACHIEVEMENT_6_20", "Have an Eldritch Creature destroy a Witch."),
"Wolf", Rarity.Uncommon, 2, 0, 2, 4, "wolf.png", "NEW_ACHIEVEMENT_3_18", "Have 3 or more Wolves adjacent to the same Moon."),
*/