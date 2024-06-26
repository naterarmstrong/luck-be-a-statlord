import { Symbol } from "../common/models/symbol";

/*
The written description of all symbols in the game. The following rules should apply when rendering:
- :this: refers to the source symbol, and should be rendered as the image for such.
- :xxx: refers to the symbol, item, or group xxx. It should be rendered as such.
- :coinXX: refers to the coin followed by the number XX, rendered in gold. The same applies for essence, removal, and reroll tokens.
- Each instance of the below should be rendered in red:
    - destroy(ed/s)
    - transform
    - remove(d/s)
    - any number
    - any percent
    - Adds
*/
export const SYMBOL_DESCRIPTIONS: Record<Symbol, string> = {
  [Symbol.Amethyst]:
    "Whenever another symbol makes this symbol give additional :coin:, this symbol permanently gives :coin1: more.",
  [Symbol.Anchor]: "Gives :coin4: more when in a corner.",
  [Symbol.Apple]: "",
  [Symbol.Banana]: "Adds :banana_peel: when destroyed.",
  [Symbol.BananaPeel]: "Destroys adjacent :thief:. Destroys itself afterward.",
  [Symbol.BarofSoap]:
    "Adds :bubble: each spin. Destroys itself after giving :coin: 3 times.",
  [Symbol.Bartender]: "Has a 10% chance of adding :booze:.",
  [Symbol.Bear]:
    "Destroys adjacent :honey:. Gives :coin40: for each :honey: destroyed.",
  [Symbol.Beastmaster]: "Adjacent :animal: give 2x more :coin:.",
  [Symbol.Bee]:
    "Adjacent :beelikes: give 2x more :coin:. Gives :coin1: more for each adjacent :beelikes:",
  [Symbol.Beehive]: "Has a 10% chance of adding :honey:.",
  [Symbol.Beer]: "",
  [Symbol.BigOre]: "Adds 2 :gem: when destroyed.",
  [Symbol.BigUrn]: "Adds 2 :spirit: when destroyed.",
  [Symbol.Billionaire]:
    "Adjacent :richlikes: give 2x more :coin:. Gives :coin39: when destroyed.",
  [Symbol.BountyHunter]:
    "Destroys adjacent :thief:. Gives :coin20: for each :thief: destroyed.",
  [Symbol.BronzeArrow]:
    "Points a random direction. Symbols that are pointed to give 2x more :coin:. Destroys :target: that are pointed to.",
  [Symbol.Bubble]: "Destroys itself after giving :coin: 3 times.",
  [Symbol.BuffingCapsule]:
    "Destroys itself. Adjacent symbols give 2x more :coin:.",
  [Symbol.Candy]: "",
  [Symbol.CardShark]: "Adjacent :suit: are :wildcard:.",
  [Symbol.Cat]:
    "Destroys adjacent :milk:. Gives :coin9: for each :milk: destroyed.",
  [Symbol.Cheese]: "",
  [Symbol.Chef]: "Adjacent :food: give 2x more :coin:.",
  [Symbol.ChemicalSeven]:
    "Destroys itself. Gives :coin7: and adds 1 :lucky_seven: item when destroyed.",
  [Symbol.Cherry]: "",
  [Symbol.Chick]: "Has a 10% chance to transform into :chicken:.",
  [Symbol.Chicken]:
    "Has a 5% chance of adding :egg:. Has a 1% chance of adding :golden_egg:.",
  [Symbol.Clubs]:
    "Adjacent :clubs: and :spades: give :coin1: more. Gives :coin1: more if there are at least 3 :suit:.",
  [Symbol.Coal]: "Transforms into :diamond: after 20 spins.",
  [Symbol.Coconut]: "Adds 2 :coconut_half: when destroyed.",
  [Symbol.CoconutHalf]: "",
  [Symbol.Coin]: "",
  [Symbol.Comedian]: "Adjacent :funny: give 3x more :coin:.",
  [Symbol.Cow]: "Has a 5% chance of adding :milk:.",
  [Symbol.Crab]: "Gives :coin3: more for each other :crab: in the same row.",
  [Symbol.Crow]: "Gives :coin-3: every 4 spins.",
  [Symbol.Cultist]:
    "Gives :coin1: more for each other :cultist:. Gives :coin1: more if there are at least 3 :this:.",
  [Symbol.Dame]:
    "Adjacent :gem: give 2x more :coin:. Destroys adjacent :martini:. Gives :coin40: for each :martini: destroyed.",
  [Symbol.Diamond]: "Gives :coin1: more for each other :this:.",
  [Symbol.Diamonds]:
    "Adjacent :diamonds: and :hearts: give :coin1: more. Gives :coin1: more if there are at least 3 :suit:.",
  [Symbol.Diver]:
    "Removes adjacent :poslikes:. Permanently gives :coin1: for each symbol removed.",
  [Symbol.Dog]:
    "Gives :coin2: if adjacent to :doglikes:. This effect only applies once per spin.",
  [Symbol.Dove]:
    "If an adjacent symbol would be destroyed, instead it isn't, and this symbol permanently gives :coin1: more.",
  [Symbol.Dud]: "Destroys itself after 33 spins. Cannot be removed.",
  [Symbol.Dwarf]:
    "Destroys adjacent :dwarflikes:. Gives :coin: equal to 10x the value of symbols destroyed this way.",
  [Symbol.Egg]: "Has a 10% chance to transform into :chick:.",
  [Symbol.EldritchCreature]:
    "Destroys :fossillikes:. Gives :coin1: for each :fossillikes: destroyed or removed this game.",
  [Symbol.Emerald]: "Gives :coin1: more if there are least 2 :this:.",
  [Symbol.Empty]: "",
  [Symbol.EssenceCapsule]: "Destroys itself. Gives :essence1: when destroyed.",
  [Symbol.Farmer]:
    "Adjacent :farmerlikes: give 2x more :coin:. Adjacent :seed: are 50% more likely to grow.",
  [Symbol.FiveSidedDie]: "Gives between :coin1: and :coin5: randomly.",
  [Symbol.Flower]: "",
  [Symbol.FrozenFossil]:
    "Destroys itself after 20 spins. The amount of spins needed is reduced by 5 for each :fossillikes: destroyed or removed this game. Adds :eldritch_beast: when destroyed.",
  [Symbol.Gambler]:
    "Gives :coin: ? when destroyed. ? increases by :coin2: each spin. Destroys itself when :d5: or :d3: roll :d5_1: or :d3_1:.",
  [Symbol.GeneralZaroff]:
    "Destroys adjacent :human:. Gives :coin25: for each :human: destroyed.",
  [Symbol.Geologist]:
    "Destroys adjacent :archlikes:. Permanently gives :coin1: for each symbol destroyed.",
  [Symbol.GoldenArrow]:
    "Points a random direction. Symbols that are pointed to give 4x more :coin:. Destroys :target: that are pointed to.",
  [Symbol.GoldenEgg]: "",
  [Symbol.Goldfish]:
    "Destroys adjacent :bubble:. Gives :coin15: for each :bubble: destroyed.",
  [Symbol.Golem]: "Destroys itself after 5 spins. Adds 5 :ore: when destroyed.",
  [Symbol.Goose]: "Has a 1% chance of adding :golden_egg:.",
  [Symbol.Hearts]:
    "Adjacent :diamonds: and :hearts: give :coin1: more. Gives :coin1: more if there are at least 3 :suit:.",
  [Symbol.HexOfDestruction]: "Has a 30% chance to destroy an adjacent symbol.",
  [Symbol.HexOfDraining]:
    "Has a 30% chance to make an adjacent symbol give :coin0:.",
  [Symbol.HexOfEmptiness]:
    "Has a 30% chance to of forcing you to skip the symbols you can add after a spin.",
  [Symbol.HexOfHoarding]:
    "Has a 30% chance of forcing you to add a symbol after this spin.",
  [Symbol.HexOfMidas]: "Has a 30% chance of adding :coin:.",
  [Symbol.HexOfTedium]:
    "You are 1.3x less likely to find Uncommon, Rare, and Very Rare symbols.",
  [Symbol.HexOfThievery]: "Has a 30% chance to take :coin6:",
  [Symbol.Highlander]: "There can only be 1 :this:.",
  [Symbol.Honey]: "",
  [Symbol.Hooligan]:
    "Destroys adjacent :spiritbox:. Gives :coin6: for each :spiritbox: destroyed.",
  [Symbol.HustlingCapsule]:
    "Destroys itself. Adds 1 :pool_ball: item when destroyed.",
  [Symbol.ItemCapsule]: "Destroys itself. Adds 1 Common item when destroyed.",
  [Symbol.Jellyfish]: "Gives :removal1: when removed.",
  [Symbol.Joker]: "Adjacent :suit: give 2x more :coin:.",
  [Symbol.Key]: "Destroys adjacent :chest:. Destroys itself afterward.",
  [Symbol.KingMidas]:
    "Adds :coin: each spin. Adjacent :coin: give 3x more :coin:.",
  [Symbol.LightBulb]:
    "Adjacent :gem: give 2x more :coin:. Destroys itself after making other symbols give additional :coin: 5 times.",
  [Symbol.Lockbox]: "Gives :coin15: when destroyed.",
  [Symbol.LuckyCapsule]:
    "Destroys itself. At least 1 of the symbols to add after this spin will be Rare or better.",
  [Symbol.MagicKey]:
    "Destroys adjacent :chest:. Symbols destroyed this way give 3x more :coin:. Destroys itself afterward.",
  [Symbol.Magpie]: "Gives :coin9: every 4 spins.",
  [Symbol.Martini]: "",
  [Symbol.MatryoshkaDoll1]:
    "Destroys itself after 3 spins. Adds :matryoshka_doll_2: when destroyed.",
  [Symbol.MatryoshkaDoll2]:
    "Destroys itself after 5 spins. Adds :matryoshka_doll_3: when destroyed.",
  [Symbol.MatryoshkaDoll3]:
    "Destroys itself after 7 spins. Adds :matryoshka_doll_4: when destroyed.",
  [Symbol.MatryoshkaDoll4]:
    "Destroys itself after 9 spins. Adds :matryoshka_doll_5: when destroyed.",
  [Symbol.MatryoshkaDoll5]: "",
  [Symbol.MegaChest]: "Gives :coin100: when destroyed.",
  [Symbol.MidasBomb]:
    "Destroys itself and all adjacent symbols. Symbols destroyed this way give :coin: equal to 7x their value.",
  [Symbol.Milk]: "",
  [Symbol.Mine]:
    "Adds :ore: each spin. Destroys itself after giving :coin: 4 times. Adds 1 :mining_pick: item when destroyed.",
  [Symbol.Miner]:
    "Destroys adjacent :minerlikes:. Gives :coin20: for each :minerlikes: destroyed.",
  [Symbol.Monkey]:
    "Destroys adjacent :monkeylikes:. Gives :coin: equal to 6x the value of symbols destroyed this way.",
  [Symbol.Moon]:
    "Adjacent :night: give 3x more :coin:. Adds 3 :cheese: when destroyed.",
  [Symbol.Mouse]:
    "Destroys adjacent :cheese:. Gives :coin20: for each :cheese: destroyed.",
  [Symbol.MrsFruit]:
    "Destroys adjacent :fruitlikes:. Permanently gives :coin1: for each symbol destroyed.",
  [Symbol.Ninja]: "Gives :coin1: more for each other :this:.",
  [Symbol.Omelette]:
    "Gives :coin2: if adjacent to :omelettestuff:. This effect only applies once per spin.",
  [Symbol.Orange]: "",
  [Symbol.Ore]: "Adds :gem: when destroyed.",
  [Symbol.Owl]: "Gives :coin1: every 3 spins.",
  [Symbol.Oyster]:
    "Has a 20% chance of adding :pearl:. Adds :pearl: when removed.",
  [Symbol.Peach]: "Adds :seed: when destroyed.",
  [Symbol.Pear]:
    "Whenever another symbol makes this symbol give additional :coin:, this symbol permanently gives :coin1: more.",
  [Symbol.Pearl]: "",
  [Symbol.Pirate]:
    "Destroys adjacent :piratelikes:. Permanently gives :coin1: for each symbol destroyed.",
  [Symbol.Pinata]: "Adds 7 :candy: when destroyed.",
  [Symbol.Plum]: "",
  [Symbol.Present]:
    "Destroys itself after 12 spins. Gives :coin10: when destroyed.",
  [Symbol.Pufferfish]: "Gives :reroll1: when removed.",
  [Symbol.Rabbit]:
    "Permanently gives :coin2: more after giving :coin: 10 times.",
  [Symbol.RabbitFluff]:
    "You are 1.2x more likely to find Uncommon, Rare, and Very Rare symbols.",
  [Symbol.Rain]:
    "Adjacent :flower: give 2x more :coin:. Adjacent :seed: are 50% more likely to grow.",
  [Symbol.RemovalCapsule]: "Destroys itself. Gives :removal1: when destroyed.",
  [Symbol.RerollCapsule]: "Destroys itself. Gives :reroll1: when destroyed.",
  [Symbol.RobinHood]:
    "Gives :coin25: every 4 spins. Adjacent :robinlikes: give :coin3: more. Destroys adjacent :robinhates:. Gives :coin15: for each :robinhates: destroyed.",
  [Symbol.Ruby]: "Gives :coin1: more if there are least 2 :this:.",
  [Symbol.Safe]: "Gives :coin30: when destroyed.",
  [Symbol.SandDollar]: "Gives :coin10: when removed.",
  [Symbol.Sapphire]: "",
  [Symbol.Seed]: "Has a 25% chance to grow into :plant:.",
  [Symbol.ShinyPebble]:
    "You are 1.1x more likely to find Uncommon, Rare, and Very Rare symbols.",
  [Symbol.SilverArrow]:
    "Points a random direction. Symbols that are pointed to give 3x more :coin:. Destroys :target: that are pointed to.",
  [Symbol.Sloth]: "Gives :coin4: every 2 spins.",
  [Symbol.Snail]: "Gives :coin5: every 4 spins.",
  [Symbol.Spades]:
    "Adjacent :clubs: and :spades: give :coin1: more. Gives :coin1: more if there are at least 3 :suit:.",
  [Symbol.Spirit]: "Destroys itself after giving :coin: 4 times.",
  [Symbol.Strawberry]: "Gives :coin1: more if there are least 2 :strawberry:.",
  [Symbol.Sun]:
    "Adjacent :flower: give 5x more :coin:. Adjacent :seed: are 50% more likely to grow.",
  [Symbol.Target]: "Gives :coin10: when destroyed.",
  [Symbol.TediumCapsule]:
    "Destroys itself. Gives :coin5: when destroyed. At least 1 of the symbols to add after this spin will be common.",
  [Symbol.Thief]:
    "Gives :coin: ? when destroyed. ? increases by :coin4: each spin.",
  [Symbol.ThreeSidedDie]: "Gives between :coin1: and :coin3: randomly.",
  [Symbol.TimeCapsule]:
    "Destroys itself. Adds 1 symbol that was destroyed this game when destroyed. Cannot add :time_capsule:.",
  [Symbol.Toddler]:
    "Destroys adjacent :toddlerlikes:. Gives :coin6: for each :toddlerlike: destroyed.",
  [Symbol.Tomb]:
    "Has a 6% chance of adding :spirit:. Adds 4 :spirit: when destroyed.",
  [Symbol.TreasureChest]: "Gives :coin50: when destroyed.",
  [Symbol.Turtle]: "Gives :coin4: every 3 spins.",
  [Symbol.Urn]: "Adds :spirit: when destroyed.",
  [Symbol.VoidCreature]:
    "Adjacent :empty: give :coin1: more. Destroys itself when adjacent to 0 :empty:. Gives :coin8: when destroyed.",
  [Symbol.VoidFruit]:
    "Adjacent :empty: give :coin1: more. Destroys itself when adjacent to 0 :empty:. Gives :coin8: when destroyed.",
  [Symbol.VoidStone]:
    "Adjacent :empty: give :coin1: more. Destroys itself when adjacent to 0 :empty:. Gives :coin8: when destroyed.",
  [Symbol.Watermelon]: "Gives :coin1: more for each other :watermelon:.",
  [Symbol.WealthyCapsule]: "Destroys itself. Gives :coin10: when destroyed.",
  [Symbol.Wildcard]:
    "Gives :coin: equal to the highest value among adjacent symbols.",
  [Symbol.Wine]: "Permanently gives :coin1: more after giving :coin: 8 times.",
  [Symbol.Witch]: "Adjacent :witchlikes: give 2x more :coin:.",
  [Symbol.Wolf]: "",
  [Symbol.Unknown]: "",
};
