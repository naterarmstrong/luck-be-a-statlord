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

export const ITEM_TO_IMG: Record<Item, string> = {
    [Item.AdoptionPapers]: "",
    [Item.AdoptionPapersEssence]: "",
    [Item.AncientLizardBlade]: "Gives :coin9: each spin. Gives :coin1: less for each symbol in your inventory with a quantity of 2 or more. Canot give less than :coin0:.",
    [Item.AncientLizardBladeEssence]: "",
    [Item.AnthropologyDegree]: ":human: give :coin1: more.",
    [Item.AnthropologyDegreeEssence]: "",
    [Item.InstantRamen]: "You add an additional item after each rent payment.",
    [Item.InstantRamenEssence]: "",
    [Item.BarrelODwarves]: "You may destroy this item and add 7 :dwarf:.",
    [Item.BarrelODwarvesEssence]: "",
    [Item.Birdhouse]: ":bird: give :coin1: more.",
    [Item.BirdhouseEssence]: "",
    [Item.BlackCat]: "",
    [Item.BlackCatEssence]: "",
    [Item.BlackPepper]: "",
    [Item.BlackPepperEssence]: "",
    [Item.BluePepper]: "",
    [Item.BluePepperEssence]: "",
    [Item.BlueSuits]: "",
    [Item.BlueSuitsEssence]: "",
    [Item.BoosterPack]: "",
    [Item.BoosterPackEssence]: "",
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