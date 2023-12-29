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
    [Item.AdoptionPapers]: "You may destroy this item and choose 3 symbols to add. The possible symbols are :animal:.",
    [Item.AdoptionPapersEssence]: "Destroys itself after 7 :animal: are added. Gives :coin77: when destroyed.",
    [Item.AncientLizardBlade]: "Gives :coin9: each spin. Gives :coin1: less for each symbol in your inventory with a quantity of 2 or more. Canot give less than :coin0:.",
    [Item.AncientLizardBladeEssence]: "Gives :coin40: and is destroyed when you spin. Gives :coin8: less for each symbol in your inventory with a quantity of 2 or more. Cannot give less than :coin0:. This effect ignores :empty:.",
    [Item.AnthropologyDegree]: ":human: give :coin1: more.",
    [Item.AnthropologyDegreeEssence]: "Destroys itself if there are at least 9 :human:. When destroyed, :human: give 1.5x more this game.",
    [Item.InstantRamen]: "You add an additional item after each rent payment.",
    [Item.InstantRamenEssence]: "Destroys itself when you skip an item. When destroyed, you add 2 items.",
    [Item.BarrelODwarves]: "You may destroy this item and add 7 :dwarf:.",
    [Item.BarrelODwarvesEssence]: "Destroys itself after 7 :dwarf: are removed. Removes all :dwarf: before each spin. Gives :coin17: whenever :dwarf: are removed.",
    [Item.Birdhouse]: ":bird: give :coin1: more.",
    [Item.BirdhouseEssence]: "Destroys itself if 3 or more :bird: are adjacent. When destroyed, :bird: give :coin2: more this game.",
    [Item.BlackCat]: "Gives :coin9: whenever you gain a multiple of :coin13: afte4r a spin. :cat: give 2x more :coin:.",
    [Item.BlackCatEssence]: "Destroys itself if there are at least 13 :cat:. When destroyed, :cat: give 13x more this game.",
    [Item.BlackPepper]: "Gives :coin1: whenever a symbol is destroyed.",
    [Item.BlackPepperEssence]: "Gives :coin10: whenever a symbol is destroyed. Destroys itself afterward.",
    [Item.BluePepper]: "Gives :coin3: if there are at least 3 :empty:.",
    [Item.BluePepperEssence]: "Gives :coin30: if there are at least 3 :empty:. Destroys itself afterwards.",
    [Item.BlueSuits]: "You may destroy this after 7 spins. Adds a :clubs: and :spades: when destroyed.",
    [Item.BlueSuitsEssence]: "Destroys itself if there are at least 4 :clubs: and :spades:. When destroyed, :clubs: and :spades: give :coin1: more this game.",
    [Item.BoosterPack]: "You may destroy this item and choose 4 Common symbols, 3 Uncommon symbols, and 1 Rare symbol to add.",
    [Item.BoosterPackEssence]: "Destroys itself after 12 spins. When destroyed, you choose 2 Uncommon and 1 Very Rare symbol to add.",
    [Item.BowlingBall]: "",
    [Item.BowlingBallEssence]: "",
    [Item.BrownPepper]: "",
    [Item.BrownPepperEssence]: "",
    [Item.CapsuleMachine]: "",
    [Item.CapsuleMachineEssence]: "",
    [Item.CardboardBox]: "",
    [Item.CardboardBoxEssence]: "",
    [Item.CheckeredFlag]: "",
    [Item.CheckeredFlagEssence]: "",
    [Item.ChickenCoop]: "",
    [Item.ChickenCoopEssence]: "",
    [Item.ChiliPowder]: "",
    [Item.ChiliPowderEssence]: "",
    [Item.CleaningRag]: "",
    [Item.CleaningRagEssence]: "",
    [Item.ClearSky]: "",
    [Item.ClearSkyEssence]: "",
    [Item.Coffee]: "",
    [Item.CoffeeEssence]: "",
    [Item.CoinOnAString]: "",
    [Item.CoinOnAStringEssence]: "",
    [Item.ComfyPillow]: "",
    [Item.ComfyPillowEssence]: "",
    [Item.CompostHeap]: "",
    [Item.CompostHeapEssence]: "",
    [Item.ConveyorBelt]: "",
    [Item.ConveyorBeltEssence]: "",
    [Item.Copycat]: "",
    [Item.CopycatEssence]: "",
    [Item.CreditCard]: "",
    [Item.CreditCardEssence]: "",
    [Item.CursedKatana]: "",
    [Item.CursedKatanaEssence]: "",
    [Item.CyanPepper]: "",
    [Item.CyanPepperEssence]: "",
    [Item.DarkHumor]: "",
    [Item.DarkHumorEssence]: "",
    [Item.DevilsDeal]: "",
    [Item.DevilsDealEssence]: "",
    [Item.Dishwasher]: "",
    [Item.DishwasherEssence]: "",
    [Item.DwarvenAnvil]: "",
    [Item.DwarvenAnvilEssence]: "",
    [Item.EggCarton]: "",
    [Item.EggCartonEssence]: "",
    [Item.Fertilizer]: "",
    [Item.FertilizerEssence]: "",
    [Item.FifthAce]: "",
    [Item.FifthAceEssence]: "",
    [Item.FishBowl]: "",
    [Item.FishBowlEssence]: "",
    [Item.Flush]: "",
    [Item.FlushEssence]: "",
    [Item.FourLeafClover]: "",
    [Item.FourLeafCloverEssence]: "",
    [Item.FrozenPizza]: "",
    [Item.FrozenPizzaEssence]: "",
    [Item.FruitBasket]: "",
    [Item.FruitBasketEssence]: "",
    [Item.FryingPan]: "",
    [Item.FryingPanEssence]: "",
    [Item.GoldenCarrot]: "",
    [Item.GoldenCarrotEssence]: "",
    [Item.Goldilocks]: "",
    [Item.GoldilocksEssence]: "",
    [Item.GraveRobber]: "",
    [Item.GraveRobberEssence]: "",
    [Item.GrayPepper]: "Gives :coin6: whenever you spend :removal:.",
    [Item.GrayPepperEssence]: "",
    [Item.GreenPepper]: "Gives :coin3: if at least 3 symbols are the same and not :empty:.",
    [Item.GreenPepperEssence]: "",
    [Item.Guillotine]: "",
    [Item.GuillotineEssence]: "",
    [Item.HappyHour]: "",
    [Item.HappyHourEssence]: "",
    [Item.HolyWater]: "",
    [Item.HolyWaterEssence]: "",
    [Item.Horseshoe]: "",
    [Item.HorseshoeEssence]: "",
    [Item.ItemMissing]: "",
    [Item.Jackolantern]: "",
    [Item.JackolanternEssence]: "",
    [Item.KyleTheKernite]: "",
    [Item.KyleTheKerniteEssence]: "",
    [Item.LeftyTheRabbit]: "",
    [Item.LeftyTheRabbitEssence]: "",
    [Item.Lemon]: "",
    [Item.LemonEssence]: "",
    [Item.LimePepper]: "",
    [Item.LimePepperEssence]: "",
    [Item.LintRoller]: "",
    [Item.LintRollerEssence]: "",
    [Item.Lockpick]: "",
    [Item.LockpickEssence]: "",
    [Item.LootingGlove]: "",
    [Item.LootingGloveEssence]: "",
    [Item.LuckyCarrot]: "",
    [Item.LuckyCarrotEssence]: "",
    [Item.LuckyCat]: "",
    [Item.LuckyCatEssence]: "",
    [Item.LuckyDice]: "",
    [Item.LuckyDiceEssence]: "",
    [Item.LuckySeven]: "",
    [Item.LuckySevenEssence]: "",
    [Item.Lunchbox]: "",
    [Item.LunchboxEssence]: "",
    [Item.MaxwellTheBear]: "",
    [Item.MaxwellTheBearEssence]: "",
    [Item.MiningPick]: "",
    [Item.MiningPickEssence]: "",
    [Item.MobiusStrip]: "",
    [Item.MobiusStripEssence]: "",
    [Item.NinjaAndMouse]: "",
    [Item.NinjaAndMouseEssence]: "",
    [Item.NoriTheRabbit]: "",
    [Item.NoriTheRabbitEssence]: "",
    [Item.OilCan]: "",
    [Item.OilCanEssence]: "",
    [Item.OswaldTheMonkey]: "",
    [Item.OswaldTheMonkeyEssence]: "",
    [Item.PiggyBank]: "",
    [Item.PiggyBankEssence]: "",
    [Item.PinkPepper]: "",
    [Item.PinkPepperEssence]: "",
    [Item.PizzaTheCat]: "",
    [Item.PizzaTheCatEssence]: "",
    [Item.PoolBall]: "",
    [Item.PoolBallEssence]: "",
    [Item.Popsicle]: "",
    [Item.PopsicleEssence]: "",
    [Item.Protractor]: "",
    [Item.ProtractorEssence]: "",
    [Item.PurplePepper]: "",
    [Item.PurplePepperEssence]: "",
    [Item.QuigleyTheWolf]: "",
    [Item.QuigleyTheWolfEssence]: "",
    [Item.Quiver]: "",
    [Item.QuiverEssence]: "",
    [Item.RainCloud]: "",
    [Item.RainCloudEssence]: "",
    [Item.Recycling]: "",
    [Item.RecyclingEssence]: "",
    [Item.RedPepper]: "",
    [Item.RedPepperEssence]: "",
    [Item.RedSuits]: "",
    [Item.RedSuitsEssence]: "",
    [Item.Reroll]: "",
    [Item.RerollEssence]: "",
    [Item.RickyTheBanana]: "",
    [Item.RickyTheBananaEssence]: "",
    [Item.RitualCandle]: "",
    [Item.RitualCandleEssence]: "",
    [Item.RustyGear]: "",
    [Item.RustyGearEssence]: "",
    [Item.ShatteredMirror]: "",
    [Item.ShatteredMirrorEssence]: "",
    [Item.SheddingSeason]: "",
    [Item.SheddingSeasonEssence]: "",
    [Item.Shrine]: "",
    [Item.ShrineEssence]: "",
    [Item.Sunglasses]: "",
    [Item.SunglassesEssence]: "",
    [Item.SwappingDevice]: "",
    [Item.SwappingDeviceEssence]: "",
    [Item.SwearJar]: "",
    [Item.SwearJarEssence]: "",
    [Item.SymbolBombBig]: "",
    [Item.SymbolBombBigEssence]: "",
    [Item.SymbolBombQuantum]: "",
    [Item.SymbolBombQuantumEssence]: "",
    [Item.SymbolBombSmall]: "",
    [Item.SymbolBombSmallEssence]: "",
    [Item.SymbolBombVeryBig]: "",
    [Item.SymbolBombVeryBigEssence]: "",
    [Item.TaxEvasion]: "",
    [Item.TaxEvasionEssence]: "",
    [Item.Telescope]: "",
    [Item.TelescopeEssence]: "",
    [Item.TimeMachine]: "",
    [Item.TimeMachineEssence]: "",
    [Item.TreasureMap]: "",
    [Item.TreasureMapEssence]: "",
    [Item.TripleCoins]: "",
    [Item.TripleCoinsEssence]: "",
    [Item.TurtleAndRabbit]: "",
    [Item.TurtleAndRabbitEssence]: "",
    [Item.Undertaker]: "",
    [Item.UndertakerEssence]: "",
    [Item.VoidParty]: "",
    [Item.VoidPartyEssence]: "",
    [Item.VoidPortal]: "",
    [Item.VoidPortalEssence]: "",
    [Item.WantedPoster]: "",
    [Item.WantedPosterEssence]: "",
    [Item.WateringCan]: "",
    [Item.WateringCanEssence]: "",
    [Item.WhitePepper]: "",
    [Item.WhitePepperEssence]: "",
    [Item.XRayMachine]: "",
    [Item.XRayMachineEssence]: "",
    [Item.YellowPepper]: "",
    [Item.YellowPepperEssence]: "",
    [Item.ZaroffsContract]: "",
    [Item.ZaroffsContractEssence]: "",
};