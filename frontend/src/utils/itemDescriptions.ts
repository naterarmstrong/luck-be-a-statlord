import { Item } from "../common/models/item";

/*
The written description of all items in the game. The following rules should apply when rendering:
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

export const ITEM_DESCRIPTIONS: Record<Item, string> = {
  [Item.AdoptionPapers]:
    "You may destroy this item and choose 3 symbols to add. The possible symbols are :animal:.",
  [Item.AdoptionPapersEssence]:
    "Destroys itself after 7 :animal: are added. Gives :coin77: when destroyed.",
  [Item.AncientLizardBlade]:
    "Gives :coin9: each spin. Gives :coin1: less for each symbol in your inventory with a quantity of 2 or more. Canot give less than :coin0:.",
  [Item.AncientLizardBladeEssence]:
    "Gives :coin40: and is destroyed when you spin. Gives :coin8: less for each symbol in your inventory with a quantity of 2 or more. Cannot give less than :coin0:. This effect ignores :empty:.",
  [Item.AnthropologyDegree]: ":human: give :coin1: more.",
  [Item.AnthropologyDegreeEssence]:
    "Destroys itself if there are at least 9 :human:. When destroyed, :human: give 1.5x more this game.",
  [Item.InstantRamen]: "You add an additional item after each rent payment.",
  [Item.InstantRamenEssence]:
    "Destroys itself when you skip an item. When destroyed, you add 2 items.",
  [Item.BarrelODwarves]: "You may destroy this item and add 7 :dwarf:.",
  [Item.BarrelODwarvesEssence]:
    "Destroys itself after 7 :dwarf: are removed. Removes all :dwarf: before each spin. Gives :coin17: whenever :dwarf: are removed.",
  [Item.Birdhouse]: ":bird: give :coin1: more.",
  [Item.BirdhouseEssence]:
    "Destroys itself if 3 or more :bird: are adjacent. When destroyed, :bird: give :coin2: more this game.",
  [Item.BlackCat]:
    "Gives :coin9: whenever you gain a multiple of :coin13: afte4r a spin. :cat: give 2x more :coin:.",
  [Item.BlackCatEssence]:
    "Destroys itself if there are at least 13 :cat:. When destroyed, :cat: give 13x more this game.",
  [Item.BlackPepper]: "Gives :coin1: whenever a symbol is destroyed.",
  [Item.BlackPepperEssence]:
    "Gives :coin10: whenever a symbol is destroyed. Destroys itself afterward.",
  [Item.BluePepper]: "Gives :coin3: if there are at least 3 :empty:.",
  [Item.BluePepperEssence]:
    "Gives :coin30: if there are at least 3 :empty:. Destroys itself afterwards.",
  [Item.BlueSuits]:
    "You may destroy this after 7 spins. Adds a :clubs: and :spades: when destroyed.",
  [Item.BlueSuitsEssence]:
    "Destroys itself if there are at least 4 :clubs: and :spades:. When destroyed, :clubs: and :spades: give :coin1: more this game.",
  [Item.BoosterPack]:
    "You may destroy this item and choose 4 Common symbols, 3 Uncommon symbols, and 1 Rare symbol to add.",
  [Item.BoosterPackEssence]:
    "Destroys itself after 12 spins. When destroyed, you choose 2 Uncommon and 1 Very Rare symbol to add.",
  [Item.BowlingBall]: "Gives :coin3:.",
  [Item.BowlingBallEssence]:
    "Destroy itself after 20 spins. Gives :coin3: each spin.",
  [Item.BrownPepper]: "Gives :coin1: whenever a symbol is added.",
  [Item.BrownPepperEssence]:
    "Gives :coin10: whenever a symbol is added. Destroys itself afterwards.",
  [Item.CapsuleMachine]: "The effects of :capsule: happen 2 times.",
  [Item.CapsuleMachineEssence]:
    "Destroys itself after :capsule: are destroyed. The effects of :capsule: happen 3 times.",
  [Item.CardboardBox]: "Gives :removal1: every 10 spins.",
  [Item.CardboardBoxEssence]:
    "Destroys itself after 12 spins. Gives :removal3: when destroyed.",
  [Item.CheckeredFlag]: ":slow: take 1 less spin to give :coin:",
  [Item.CheckeredFlagEssence]:
    "Destroys itself after :slow: give :coin: 7 times. :slow: take 0 spins to give additional :coin:.",
  [Item.ChickenCoop]:
    ":chickenstuff: give :coin2: more. :chicken: are 3x more likely to add symbols. :egg: are 3x more likely to transform.",
  [Item.ChickenCoopEssence]:
    "Destroys itself with :egg: transforms into :chick: and grows into :chicken: in the same spin. When destroyed, :chickenstuff: give :coin4: more this game.",
  [Item.ChiliPowder]: "Gives :coin2: for each :pepper:.",
  [Item.ChiliPowderEssence]:
    "Destroys itself when you pay rent. When destroyed, you choose 1 :pepper: to add.",
  [Item.CleaningRag]: ":gem: give :coin1: more.",
  [Item.CleaningRagEssence]:
    "Destroys itself if there are at least 5 :gem:. When destroyed, :gem: give 2x more :coin: this game.",
  [Item.ClearSky]: ":sun: and :moon: affect non-adjacent symbols as well.",
  [Item.ClearSkyEssence]:
    "Destroys itself if :sun: and :moon: are adjacent to each other. When destroyed, :sun: and :moon: give 2x more :coin: and affect non-adjacent symbols as well this game.",
  [Item.Coffee]:
    "If you can't afford your rent, you may destroy this item and spin an additional time.",
  [Item.CoffeeEssence]:
    "Destroys itself before you would pay rent. When destroyed, you spin 2 additional times.",
  [Item.CoinOnAString]:
    "Gives :coin1:. Removes all :coin: before each spin. Gives :coin3: whenever :coin: is removed.",
  [Item.CoinOnAStringEssence]:
    "Destroys itself after 10 :coin: are removed. Removes all :coin: before each spin. Gives :coin10: whenever :coin: are removed.",
  [Item.ComfyPillow]:
    "If you have 1 spin left before your rent is due, you may skip your next spin. If you do, at least 1 of the items to add after paying rent will be Rare or better.",
  [Item.ComfyPillowEssence]:
    "If you have 2 spins left before your rent is due, you may destroy this item and skip your next 2 spins. If you do, at least 1 of the items to add after paying rent will be Very Rare.",
  [Item.CompostHeap]:
    ":seed: is added whenever 3 symbols are destroyed. :seed: will only grow into Uncommon or better symbols.",
  [Item.CompostHeapEssence]:
    "2 :watermelon: are added whenever 3 symbols are destroyed in the same spin. Destroys itself afterwards.",
  [Item.ConveyorBelt]: ":spawner0: are 2x more likely to add symbols.",
  [Item.ConveyorBeltEssence]:
    "Destroys itself after 5 symbols are added from :spawner0:. When destroyed, :spawner0: are 2x more likely to add symbols this game.",
  [Item.Copycat]: ":cat: are :wildcard:.",
  [Item.CopycatEssence]:
    "Destroys itself if 5 or more :cat: are adjacent. :cat: are :wildcard: and give 1.5x more.",
  [Item.CreditCard]:
    "Every 7 spins, you have 17 more symbols to choose from after a spin.",
  [Item.CreditCardEssence]:
    "Destroys itself when you spin. You have 27 more symbols to choose from after a spin.",
  [Item.CursedKatana]: ":ninja: give :coin2: more for each other :ninja:.",
  [Item.CursedKatanaEssence]:
    "Destroys itself if there are at least 2 :ninja:. When destroyed, :ninja: give :coin3: more this game.",
  [Item.CyanPepper]:
    "Gives :coin3: unless 3 or more symbols are the same. This effect ignores :empty:.",
  [Item.CyanPepperEssence]:
    "Gives :coin30: unless 3 or more symbols are the same. This effect ignores :empty:. Destroys itself afterwards.",
  [Item.DarkHumor]:
    ":darkhumor: give 3x more :coin: when adjacent to :comedian:. :comedian: are Uncommon instead of Rare.",
  [Item.DarkHumorEssence]:
    "Destroys itself if :comedian: is destroyed. :comedian: is destroyed when adjacent to :banana_peel:. When destroyed, :darkhumor: give :coin2: more this game.",
  [Item.DevilsDeal]:
    "You may destroy this item and add 6 :dud: instead of paying rent.",
  [Item.DevilsDealEssence]:
    "Destroys itself if you can't afford your rent. Gives :coin33: when destroyed.",
  [Item.Dishwasher]: "Gives :essence1: every 12 spins.",
  [Item.DishwasherEssence]:
    "Destroys itself after 18 spins. Gives :essence3: when destroyed.",
  [Item.DwarvenAnvil]:
    ":dwarf: give 2x more :coin: and destroy adjacent :ore: and :big_ore:.",
  [Item.DwarvenAnvilEssence]:
    "Destroys itself if :anvillikes: are destroyed by :dwarf:. When destroyed, :dwarf: give 1.5x more :coin: this game.",
  [Item.EggCarton]:
    "Puts all :egg: in this item before each spin. Gives :coin1: for each :egg: in this item, up to a maximum of :coin6: each spin.",
  [Item.EggCartonEssence]:
    "Destroys itself after 12 :egg: are removed. Removes all :egg: before each spin. Gives :coin12: whenever :egg: are removed.",
  [Item.Fertilizer]:
    ":seed: will only grow into Rare or better symbols. :seed: are 50% more likely to grow.",
  [Item.FertilizerEssence]:
    "Destroys itself before :seed: would grow. When destroyed, :seed: are guaranteed to grow into Very Rare symbols this spin.",
  [Item.FifthAce]:
    ":clubs: and :spades: give :coin1: more when adjacent to :diamonds: and :hearts:. :diamonds: and :hearts: give :coin1: more when adjacent to :clubs: and :spades:.",
  [Item.FifthAceEssence]:
    "Destroys itself if there are at least 4 :suit:. When destroyed, :suit: give :coin1: more this game.",
  [Item.FishBowl]:
    "Puts all :goldfish: in this item before each spin. Gives :coin1: for each :goldfish: in this item.",
  [Item.FishBowlEssence]:
    "Destroys itself after 10 :goldfish: are removed. Removes all :goldfish: before each spin. Gives :coin10: whenever :goldfish: are removed.",
  [Item.Flush]:
    ":suit: are Common instead of Uncommon. Removes all :suit: before each spin. Gives :coin12: whenever :suit: are removed.",
  [Item.FlushEssence]:
    "Destroys itself after 6 :suit: are removed. Removes all :suit: before each spin. Gives :coin20: whenever :suit: are removed.",
  [Item.FourLeafClover]: "Gives :coin4:.",
  [Item.FourLeafCloverEssence]:
    "Destroys itself after 15 spins. Gives :coin4: each spin.",
  [Item.FrozenPizza]: "You add an extra symbol after every 2 spins.",
  [Item.FrozenPizzaEssence]:
    "Destroys itself after 5 symbols are added after a spin. You add an extra symbol after every spin.",
  [Item.FruitBasket]: ":fruit: give :coin1: more.",
  [Item.FruitBasketEssence]:
    "Destroys itself if there are at least 5 :fruit:. When destroyed, :fruit: give 2x more :coin: this game.",
  [Item.FryingPan]:
    ":egg: are destroyed when adjacent to :omelettestuff:. Adds :omelette: whenever :egg: are destroyed.",
  [Item.FryingPanEssence]:
    ":egg: are destroyed when adjacent to :omelettestuff:. Adds :omelette: and destroys itself whenever :egg: are destroyed, :omelette: give 3x more :coin: this game.",
  [Item.GoldenCarrot]:
    "You are 5x more likely to find Uncommon, Rare, and Very Rare symbols. :rabbit: give 5x more :coin:.",
  [Item.GoldenCarrotEssence]:
    "Destroys itself after 7 spins. When destroyed, at least 1 of the symbols to add after this spin will be Very Rare.",
  [Item.Goldilocks]: "You may destroy this item and add 3 :bear:.",
  [Item.GoldilocksEssence]:
    "Destroys itself if there are are at least 3 :bear:. When destroyed, :bear: give :coin1: more this game.",
  [Item.GraveRobber]: ":spiritbox: have a 66% chance of being destroyed.",
  [Item.GraveRobberEssence]:
    "Destroys itself if :spiritbox: is destroyed. When destroyed, :spiritbox: add 2x as many :spirit: this game.",
  [Item.GrayPepper]: "Gives :coin6: whenever you spend :removal:.",
  [Item.GrayPepperEssence]:
    "Gives :coin30: whenever you spend :removal:. Destroys itself afterwards.",
  [Item.GreenPepper]:
    "Gives :coin3: if at least 3 symbols are the same and not :empty:.",
  [Item.GreenPepperEssence]:
    "Gives :coin30: if at least 3 symbols are the same and not :empty:. Destroys itself afterwards.",
  [Item.Guillotine]: ":billionaire: are destroyed.",
  [Item.GuillotineEssence]:
    "If you have :coin1000000000: or more, you are destroyed.",
  [Item.HappyHour]: ":booze: give :coin1: more.",
  [Item.HappyHourEssence]:
    "Destroys itself after 3 :booze: are destroyed. When destroyed, :booze: give 1.5x as much :coin: this game.",
  [Item.HolyWater]: ":hex: have no effect and give :coin1: more.",
  [Item.HolyWaterEssence]:
    "Destroys itself if there are at least 6 :hex:. When destroyed, :hex: have no effect and give 2x more :coin: this game.",
  [Item.Horseshoe]: "Gives :coin2:.",
  [Item.HorseshoeEssence]:
    "Destroys itself after 30 spins. Gives :coin2: each spin.",
  [Item.ItemMissing]: "",
  [Item.Jackolantern]: ":halloween: give 2x more :coin:.",
  [Item.JackolanternEssence]:
    "Destroys itself if :candy: is destroyed by :toddler:. When destroyed, :candy: and :toddler: give 1.5x more :coin: this game.",
  [Item.KyleTheKernite]: ":kyle: give :coin1: more.",
  [Item.KyleTheKerniteEssence]:
    "Destroys itself if there are at least 3 :kyle:. When destroyed, :kyle: give :coin2: more this game.",
  [Item.LeftyTheRabbit]:
    "Adds :rabbit_fluff: every 10 spins. :rabbit: and :rabbit_fluff: in the leftmost column give 2x more :coin:.",
  [Item.LeftyTheRabbitEssence]:
    "Destroys itself if there are at least 6 :rabbit: or :rabbit_fluff:. :rabbit: or :rabbit_fluff: in the leftmost column give 3x more :coin:.",
  [Item.Lemon]: ":empty: give :coin1:.",
  [Item.LemonEssence]:
    "Destroys itself if there are at least 4 :empty:. :empty: give :coin4: more.",
  [Item.LimePepper]: "Gives :coin6: when you spend :reroll1:.",
  [Item.LimePepperEssence]:
    "Gives :coin30: whenever you spend :reroll1:. Destroys itself afterwards.",
  [Item.LintRoller]:
    "Removes all :rabbit_fluff: before each spin. Gives :coin12: whenever :rabbit_fluff: are removed.",
  [Item.LintRollerEssence]:
    "Destroys itself after 6 :rabbit_fluff: are removed. Removes all :rabbit_fluff: before each spin. Gives :coin20: whenever :rabbit_fluff: are removed.",
  [Item.Lockpick]: ":chest: have a 35% chance of being destroyed.",
  [Item.LockpickEssence]:
    "Destroys itself after 3 :chest: are destroyed. :chest: have a 100% chance of being destroyed.",
  [Item.LootingGlove]: ":box: give 1.5x more :coin: when destroyed.",
  [Item.LootingGloveEssence]:
    "Destroys itself after :box: is destroyed. :box: give 3.5x more :coin: when destroyed.",
  [Item.LuckyCarrot]:
    "You are 3x more likely to find Uncommon, Rare, and Very Rare symbols. :rabbit: give 3x more :coin:.",
  [Item.LuckyCarrotEssence]:
    "Destroys itself after 15 spins. When destroyed, at least 1 of the symbols to add after this spin will be Very Rare.",
  [Item.LuckyCat]:
    "You are 1.3x more likely to find Uncommon, Rare, and Very Rare symbols for each :cat:.",
  [Item.LuckyCatEssence]:
    "Destroys itself if there are at least 3 :cat:. When destroyed, you are 2.5x more likely to find Uncommon, Rare, and Very Rare symbols.",
  [Item.LuckyDice]: ":d3: will always roll :d3:. :d5: will always roll :d5:.",
  [Item.LuckyDiceEssence]:
    "Destroys itself after :d3: and :d5: give :coin: 10 times. :d3: and :d5: give :coin1: more. :d3: will always roll :d3:. :d5: will always roll :d5:.",
  [Item.LuckySeven]:
    "If you have 3 of this item, they are destroyed and give :coin77: total.",
  [Item.LuckySevenEssence]:
    "Destroys itself after 7 spins. When destroyed, :chemical_seven: is Common instead of Uncommon this game.",
  [Item.Lunchbox]:
    "You may destroy this item and choose 3 symbols to add. The possible symbols are :food:.",
  [Item.LunchboxEssence]:
    "Destroys itself after 7 :food: are added. Gives :coin33: when destroyed.",
  [Item.MaxwellTheBear]: ":bear: give 1.5x more :coin:.",
  [Item.MaxwellTheBearEssence]:
    "Destroys itself if :honey: is destroyed by :bear:. When destroyed, :bear: give 1.5x more :coin: this game.",
  [Item.MiningPick]:
    "Gives :coin10: whenever :ore: or :big_ore: are destroyed.",
  [Item.MiningPickEssence]:
    "Destroys itself after 5 :ore: and :big_ore: are destroyed. Gives :coin50: when destroyed.",
  [Item.MobiusStrip]:
    ":box: have a 50% chance of being added when destroyed. This effect can only happen 7 times per spin.",
  [Item.MobiusStripEssence]:
    "Destroys itself after 7 :box: are destroyed. When destroyed, :box: give 1.5x more :coin: this game.",
  [Item.NinjaAndMouse]:
    ":ninja: and :mouse: give 6x more Coin when adjacent to each other. This effect only applies once per spin.",
  [Item.NinjaAndMouseEssence]:
    "Destroys itself if :ninja: and :mouse: are adjacent to each other. When destroyed, :ninja: and :mouse: give :coin2: more this game.",
  [Item.NoriTheRabbit]: ":rabbit: and :rabbit_fluff: give :coin1: more.",
  [Item.NoriTheRabbitEssence]:
    "Destroys itself if there are at least 4 :rabbit: and :rabbit_fluff:. When destroyed, :rabbit: and :rabbit_fluff: give 1.5x more :coin: this game.",
  [Item.OilCan]:
    "You may re-spin a column of symbols once every 5 spins. Symbols in the re-spun column give 2x more :coin:.",
  [Item.OilCanEssence]:
    "Destroys itself after 7 re-spins. You may re-spin a column of symbols once per spin. Symbols in the re-spun column give 2x more :coin:.",
  [Item.OswaldTheMonkey]: ":monkey: give 2x more :coin:.",
  [Item.OswaldTheMonkeyEssence]:
    "Destroys itself if :monkeylikes: is destroyed by :monkey:. When destroyed, :monkey: give 2x more :coin: this game.",
  [Item.PiggyBank]:
    "You put :coin2: in this item each spin. You may destroy this item and gain 2.5x the :coin: inside it.",
  [Item.PiggyBankEssence]:
    "Destroys itself after 25 spins. You put :coin2: in the item each spin. Gives :coin152: when destroyed.",
  [Item.PinkPepper]: "Gives :coin2: whenever you skip.",
  [Item.PinkPepperEssence]:
    "Gives :coin20: whenever you skip. Destroys itself afterwards.",
  [Item.PizzaTheCat]: ":cat: give :coin1: more.",
  [Item.PizzaTheCatEssence]:
    "Destroys itself if :milk: is destroyed by :cat:. When destroyed, :cat: give 1.5x more :coin: this game.",
  [Item.PoolBall]: "Gives :coin1:.",
  [Item.PoolBallEssence]:
    "Destroys itself after 60 spins. Gives :coin1: each spin.",
  [Item.Popsicle]:
    "The conditional effects of essences must happen 2 times for them to be destroyed.",
  [Item.PopsicleEssence]:
    "Destroys itself whenever an essence is destroyed. The conditional effects of other essences must happen 2 times for them to be destroyed.",
  [Item.Protractor]:
    "Every 3 spins, symbols in a corner are considered adjacent to all symbols.",
  [Item.ProtractorEssence]:
    "Destroys itself after 4 spins. Symbols in a corner are considered adjacent to all symbols.",
  [Item.PurplePepper]:
    "Gives :coin: if 3 or more of the same symbol are adjacent and not :empty:.",
  [Item.PurplePepperEssence]:
    "Gives :coin50: if 3 or more of the same symbol are adjacent and not :empty:. Destroys itself afterwards.",
  [Item.QuigleyTheWolf]:
    ":wolf: give :coin1: more. :dog: transform into :wolf:.",
  [Item.QuigleyTheWolfEssence]:
    "Destroys itself if 3 or more :dog: and :wolf: are adjacent. When destroyed, :dog: transform into :wolf: and :wolf: give :coin2: more this game.",
  [Item.Quiver]: ":arrow: point 2 directions.",
  [Item.QuiverEssence]:
    "Destroys itself whenever :arrow: point to 0 symbols. :arrow: point 2 directions.",
  [Item.RainCloud]:
    ":raindrop: give :coin1: more and are Common instead of Uncommon.",
  [Item.RainCloudEssence]:
    "Destroys itself if :rain: and :flower: are adjacent to each other. When destroyed, :rain: and :flower: give :coin1: more this game.",
  [Item.Recycling]: "Gives :reroll1: each spin.",
  [Item.RecyclingEssence]:
    "Destroys itself when you spin. Give :reroll5: when destroyed.",
  [Item.RedPepper]: "Gives :coin5: if every symbol is different",
  [Item.RedPepperEssence]:
    "Gives :coin50: if every symbol is different. This effect ignores :empty:. Destroys itself afterwards.",
  [Item.RedSuits]:
    "You may destroy this after 7 spins. Adds a :diamonds: and :hearts: when destroyed.",
  [Item.RedSuitsEssence]:
    "Destroys itself if there are at least 4 :diamonds: and :hearts:. When destroyed, :diamonds: and :hearts: give :coin1: more this game.",
  [Item.Reroll]:
    ":d3: that roll less than a :d3_2: and :d5: that roll less than a :d5_3: will reroll once.",
  [Item.RerollEssence]:
    "Destroys itself after :d3: and :d5: reroll 2 times. :d3: that roll less than :d3_2: and :d5: that roll less than :d5_3: will reroll once. :d3: will always reroll into :d3:. :d5: will always reroll into :d5:.",
  [Item.RickyTheBanana]: ":banana: and :banana_peel: give :coin2: more.",
  [Item.RickyTheBananaEssence]:
    "Destroys itself if there are at least 3 :banana: and :banana_peel:. When destroyed, :banana: and :banana_peel: give :coin2: more this game.",
  [Item.RitualCandle]: ":fossillikes: give :coin1: more.",
  [Item.RitualCandleEssence]:
    "Destroys itself if there at least 6 :fossillikes:. When destroyed, :fossillikes: give 2x more :coin: this game.",
  [Item.RustyGear]:
    "If 3 or more of the same symbol are adjacent and not :empty:, they give 2x more :coin:.",
  [Item.RustyGearEssence]:
    "If 3 or more of the same symbol are adjacent and not :empty:, they permanently give 1.5x more :coin:. Destroys itself afterwards.",
  [Item.ShatteredMirror]:
    "Gives :coin24: every 7 spins. You have 1 less symbol to choose from after a spin.",
  [Item.ShatteredMirrorEssence]:
    "Destroys itself after 7 symbols are added after a spin. You have 1 less symbol to choose from after a spin. Gives :coin77: when destroyed.",
  [Item.SheddingSeason]: ":rabbit: have a 15% chance of adding :rabbit_fluff:.",
  [Item.SheddingSeasonEssence]:
    ":rabbit: have a 100% chance of adding 5 :rabbit_fluff:. Destroys itself afterwards.",
  [Item.Shrine]: ":organism: add :spirit: when destroyed.",
  [Item.ShrineEssence]:
    "Destroys itself after 4 :spirit: are destroyed. :spirit: add :organism: when destroyed.",
  [Item.Sunglasses]:
    "Gives :removal1: each spin if you have :removal3: or more.",
  [Item.SunglassesEssence]:
    "Gives :removal5: if you have :removal3: or more. Destroys itself afterwards.",
  [Item.SwappingDevice]:
    "You may swap the positions of 2 symbols once per spin.",
  [Item.SwappingDeviceEssence]:
    "Destroys itself after 7 swaps. You may swap the positions of 2 symbols once per spin. Symbols swapped this way give 2x more :coin:.",
  [Item.SwearJar]:
    "You put :coin: in this item each time you spin and gain :coin35: or less. You may destroy this item and gain 3x the :coin: inside it.",
  [Item.SwearJarEssence]:
    "Destroys itself if you spin and gain :coin25: or less. Gives :coin50: when destroyed.",
  [Item.SymbolBombBig]:
    "You may destroy this item and choose 4 symbols to add.",
  [Item.SymbolBombBigEssence]:
    "Destroys itself after 4 symbols are added after a spin. Gives :removal2: when destroyed.",
  [Item.SymbolBombQuantum]:
    "You may destroy this item and choose 9 symbols to add that were previously seen after a spin but weren't added.",
  [Item.SymbolBombQuantumEssence]:
    "Destroys itself after 3 symbols are added after a spin. Adds 1 :symbol_bomb_quantum: item when destroyed.",
  [Item.SymbolBombSmall]:
    "You may destroy this item and choose 2 symbols to add.",
  [Item.SymbolBombSmallEssence]:
    "Destroys itself after 2 symbols are added after a spin. Gives :removal1: when destroyed.",
  [Item.SymbolBombVeryBig]:
    "You may destroy this item and choose 8 symbols to add.",
  [Item.SymbolBombVeryBigEssence]:
    "Destroys itself after 8 symbols are added after a spin. Gives :removal4: when destroyed.",
  [Item.TaxEvasion]: "If a symbol would take :coin:, it takes :coin1: less.",
  [Item.TaxEvasionEssence]:
    "If a symbol would take :coin:, it takes :coin25: less. Destroys itself afterwards.",
  [Item.Telescope]: "Every 3 spins, all symbols are considered adjacent.",
  [Item.TelescopeEssence]:
    "Destroys itself after 3 spins. All symbols are considered adjacent.",
  [Item.TimeMachine]:
    ":coal: take 5 less spins to transform. :destroyable_matryoshka: take 2 less spins to be destroyed. :time_machine3: take 5 less spins to be destroyed.",
  [Item.TimeMachineEssence]:
    "Destroys itself after 2 :time_machine: are destroyed or transform. :time_machine: take 0 spins to be destroyed or transform.",
  [Item.TreasureMap]:
    "You may destroy this item after 20 spins. Adds :key: and :treasure_chest: when destroyed.",
  [Item.TreasureMapEssence]:
    "Destroys itself after 33 spins. Adds :key: and :mega_chest: when destroyed.",
  [Item.TripleCoins]: ":coin: give 3x more :coin:.",
  [Item.TripleCoinsEssence]:
    "Destroys itself if there are at least 3 :coin:. When destroyed, :coin: give :coin2: more this game.",
  [Item.TurtleAndRabbit]:
    "Gives :coin77: and is destroyed if :rabbit: is in the leftmost column and :turtle: is in the rightmost column.",
  [Item.TurtleAndRabbitEssence]:
    "Destroys itself if :rabbit: and :turtle: are adjacent to each other. When destroyed, :rabbit: and :turtle: give :coin2: more this game.",
  [Item.Undertaker]: ":spirit: cannot be destroyed.",
  [Item.UndertakerEssence]:
    "Destroys itself if there are at least 4 :spirit:. When destroyed, :spirit: give :coin2: more this game.",
  [Item.VoidParty]:
    ":void: are Common instead of Uncommon. :void: have a 50% chance of being added when destroyed. This effect can only happen 7 times each spin.",
  [Item.VoidPartyEssence]:
    "Destroys itself after 5 :void: are destroyed. When destroyed, :void: give 1.5x more :coin: this game.",
  [Item.VoidPortal]: "Gives :coin1: for every 8 symbols destroyed this game.",
  [Item.VoidPortalEssence]:
    "Destroys itself if a symbol is destroyed. Gives :coin1: for each symbol destroyed this game when destroyed.",
  [Item.WantedPoster]: ":thief: give 3.5x more :coin:.",
  [Item.WantedPosterEssence]:
    "Destroys itself if :thief: is destroyed by :bounty_hunter:. When destroyed, :bounty_hunter: give 2.5x more :coin: this game.",
  [Item.WateringCan]:
    ":seed: are 100% more likely to grow. :seed: give :coin12: more.",
  [Item.WateringCanEssence]:
    "Destroys itself whenever :seed: grow. :seed: give :coin20: more.",
  [Item.WhitePepper]:
    "Gives :coin3: whenever you gain a multiple of :coin3: after a spin.",
  [Item.WhitePepperEssence]:
    "Gives :coin30: you gain a multiple of :coin3: after a spin. Destroys itself afterwards.",
  [Item.XRayMachine]:
    ":ore: and :big_ore: will only add Rare or better symbols.",
  [Item.XRayMachineEssence]:
    "Destroys itself before :ore: or :big_ore: would be destroyed. When destroyed, :ore: or :big_ore: are guaranteed to add Very Rare symbols this spin.",
  [Item.YellowPepper]: "Gives :coin2: if none of the symbols are :empty:.",
  [Item.YellowPepperEssence]:
    "Gives :coin20: if none of the symbols are :empty:. Destroys itself afterwards.",
  [Item.ZaroffsContract]:
    ":bounty_hunter: destroy adjacent :human:. :bounty_hunter: give :coin25: for each symbol destroyed.",
  [Item.ZaroffsContractEssence]:
    "Destroys itself if :human: is destroyed by :bounty_hunter: or :general_zaroff:. Gives :coin50: when destroyed.",
};
