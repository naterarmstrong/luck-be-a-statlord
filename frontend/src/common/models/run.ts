import { Item } from "./item";
import { ArrowDirections, Symbol } from "./symbol";

// Rename to RunSummary?
export class RunInfo {
    hash: string;
    number: number;
    victory: boolean;
    guillotine: boolean;
    spins: number;
    // The unix timestamp of the run's completion
    date: number;
    // The length in milliseconds of the run
    duration: number;
    // The version of luck be a landlord. Should this be 3 numbers?? or only major version?
    version: string;

    // The most valuable earlygame symbols
    earlySyms: Array<Symbol>;
    midSyms: Array<Symbol>;
    lateSyms: Array<Symbol>;

    details?: RunDetails;

    constructor(
        hash: string,
        number: number,
        version: string,
        date: number,
        duration: number,
        victory: boolean,
        guillotine: boolean,
        spins: number,
        earlySyms: Symbol[],
        midSyms: Symbol[],
        lateSyms: Symbol[],
    ) {
        this.hash = hash;
        this.number = number;
        this.version = version;
        this.date = date;
        this.duration = duration;
        this.victory = victory;
        this.guillotine = guillotine;
        this.spins = spins;
        this.earlySyms = earlySyms;
        this.midSyms = midSyms;
        this.lateSyms = lateSyms;
    }
}

export class RunDetails {
    // The details on each spin
    spins: SpinData[];
    // Aggregated information on the coins earned per symbol
    coinsPerSymbol: Map<Symbol, number>;
    // How many times symbols appeared in total
    showsPerSymbol: Map<Symbol, number>;
    // First appearance per symbol
    firstShowPerSymbol: Map<Symbol, number>;
    // Endless specific metrics
    endlessCoinsPerSymbol?: Map<Symbol, number>;
    endlessShowsPerSymbol?: Map<Symbol, number>;

    // Running inventory. Gets deleted before serialization
    inventory?: Map<Symbol, number>;

    // Symbol Details
    symbolDetails: Map<Symbol, SymbolStats>;
    itemDetails: Map<Item, ItemStats>;
    isFloor20: boolean;

    constructor() {
        this.spins = [];
        this.coinsPerSymbol = new Map();
        this.showsPerSymbol = new Map();
        this.firstShowPerSymbol = new Map();
        this.symbolDetails = new Map();
        this.itemDetails = new Map();
        this.inventory = getSymbolAddedMap();
        this.isFloor20 = true;
    }

    // This should only be called when the player has not yet won
    recordSymbol2(rentsPaid: number, symbol: Symbol, value: number) {
        if (!this.isFloor20 || rentsPaid > 13) {
            return;
        }

        if (!this.inventory!.get(symbol) && symbol != Symbol.Empty) {
            console.error("Encountered symbol I shouldn't have", symbol, this.inventory);
        }

        const existing = this.symbolDetails.get(symbol);
        if (!existing) {
            const newVal = {
                totalCoins: value,
                totalShows: 1,
                addedByChoice: 0,
                addedByEffect: 0,
                timesRemovedByEffect: 0,
                timesDestroyedByEffect: 0,
                timesRemovedByPlayer: 0,
                timesAddedChoiceByRent: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                coinsByRentPayment: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            };
            newVal.coinsByRentPayment[rentsPaid] += value;
            this.symbolDetails.set(symbol, newVal);
            return;
        }

        existing.totalCoins += value;
        existing.totalShows += 1;
        existing.coinsByRentPayment[rentsPaid] += value;
    }

    recordSymbolAdded(rentsPaid: number, symbol: Symbol, choice: boolean) {
        if (!this.isFloor20 || rentsPaid > 13) {
            return;
        }

        this.inventory!.set(symbol, (this.inventory!.get(symbol) ?? 0) + 1);

        const existing = this.symbolDetails.get(symbol);
        if (!existing) {
            const newVal = {
                totalCoins: 0,
                totalShows: 0,
                earlistRentAdded: rentsPaid,
                addedByChoice: 0,
                addedByEffect: 0,
                timesRemovedByEffect: 0,
                timesDestroyedByEffect: 0,
                timesRemovedByPlayer: 0,
                timesAddedChoiceByRent: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                coinsByRentPayment: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            };
            if (choice) {
                newVal.addedByChoice += 1;
                newVal.timesAddedChoiceByRent[rentsPaid] += 1;
            } else {
                newVal.addedByEffect += 1;
            }
            this.symbolDetails.set(symbol, newVal);
            return;
        }

        if (existing.earliestRentAdded === undefined) {
            existing.earliestRentAdded = rentsPaid;
        }
        if (choice) {
            existing.addedByChoice += 1;
            existing.timesAddedChoiceByRent[rentsPaid] += 1;
        } else {
            existing.addedByEffect += 1;
        }
    }

    recordSymbolDestroyed(rentsPaid: number, symbol: Symbol) {
        if (!this.isFloor20 || rentsPaid > 13) {
            return;
        }

        if (!this.inventory!.get(symbol)) {
            console.error("Encountered symbol I shouldn't have", symbol, this.inventory);
        }
        this.inventory!.set(symbol, (this.inventory!.get(symbol) ?? 0) - 1);
        if (this.inventory!.get(symbol)! < 0) {
            console.error("Encountered symbol with negative count", symbol, this.inventory);
        }

        const existing = this.symbolDetails.get(symbol);
        if (!existing) {
            throw new Error("Symbol destroyed before being added or seen");
        }
        existing.timesDestroyedByEffect += 1;
    }

    recordSymbolRemoved(rentsPaid: number, symbol: Symbol) {
        if (!this.isFloor20 || rentsPaid > 13) {
            return;
        }

        if (!this.inventory!.get(symbol)) {
            console.error("Encountered symbol I shouldn't have", symbol, this.inventory);
        }
        this.inventory!.set(symbol, (this.inventory!.get(symbol) ?? 0) - 1);

        const existing = this.symbolDetails.get(symbol);
        if (!existing) {
            throw new Error("Symbol destroyed before being added or seen");
        }
        existing.timesRemovedByEffect += 1;
    }

    recordItemAdded(rentsPaid: number, item: Item, choice: boolean) {
        if (!this.isFloor20 || rentsPaid > 13) {
            return;
        }

        const existing = this.itemDetails.get(item);
        if (!existing) {
            const newVal = {
                earliestRentAdded: rentsPaid,
                timesAddedByChoice: 0,
                timesAddedNoChoice: 0,
                timesDestroyed: 0,
                timesAddedByRent: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                timesDestroyedByRent: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            };
            if (choice) {
                newVal.timesAddedByChoice += 1;
            } else {
                newVal.timesAddedNoChoice += 1;
            }
            newVal.timesAddedByRent[rentsPaid] = 1;
            this.itemDetails.set(item, newVal);
            return;
        }

        existing.timesAddedNoChoice += 1;
        existing.timesAddedByRent[rentsPaid] = 1;
    }

    recordItemDestroyed(rentsPaid: number, item: Item) {
        if (!this.isFloor20 || rentsPaid > 13) {
            return;
        }

        const existing = this.itemDetails.get(item);
        if (!existing) {
            throw new Error(`Item destroyed before being added: ${item}`)
        }
        existing.timesDestroyed += 1;
        existing.timesDestroyedByRent[rentsPaid] += 1;
    }

    markNotFloor20() {
        this.isFloor20 = false;
    }

    endRecording() {
        if (!this.isFloor20) {
            this.symbolDetails.clear()
            this.itemDetails.clear()
        }
        this.symbolDetails.delete(Symbol.Dud);
        this.symbolDetails.delete(Symbol.Empty);
        delete this.inventory;
    }

    getBest3Symbols(): Array<Symbol> {
        return (new Array(...this.symbolDetails.entries())).sort(([, a], [, b]) => b.totalCoins - a.totalCoins).slice(0, 3).map((s) => s[0])
    }

    recordSymbol(spinNum: number, symbol: Symbol, value: number, isEndless: boolean) {
        if (!isEndless) {
            this.showsPerSymbol.set(symbol, (this.showsPerSymbol.get(symbol) ?? 0) + 1);
            this.coinsPerSymbol.set(symbol, (this.coinsPerSymbol.get(symbol) ?? 0) + value);
            if (this.firstShowPerSymbol.get(symbol) === undefined && !isEndless) {
                this.firstShowPerSymbol.set(symbol, spinNum);
            }
        } else {
            if (!this.endlessCoinsPerSymbol || !this.endlessShowsPerSymbol) {
                this.endlessCoinsPerSymbol = new Map(this.coinsPerSymbol);
                this.endlessShowsPerSymbol = new Map(this.showsPerSymbol);
            }
            this.endlessShowsPerSymbol.set(symbol, (this.endlessShowsPerSymbol.get(symbol) ?? 0) + 1);
            this.endlessCoinsPerSymbol.set(symbol, (this.endlessCoinsPerSymbol.get(symbol) ?? 0) + value);
        }
    }
}

function getSymbolAddedMap(): Map<Symbol, number> {
    const ret = new Map();
    ret.set(Symbol.Dud, 3);
    ret.set(Symbol.Cat, 1);
    ret.set(Symbol.Coin, 1);
    ret.set(Symbol.Flower, 1);
    ret.set(Symbol.Cherry, 1);
    ret.set(Symbol.Pearl, 1);
    return ret;
}

export interface SpinData {
    victory: boolean

    number: number
    // There's some funkiness going on with coin numbers
    currentCoins: number
    coinsGained: number
    coinTotal: number

    // Don't bother including fine print, because we can't disambiguate fine print definitions
    // easily regardless. Not only that, fine print effects are shown in effects when relevant

    preEffectItems: Array<SpinItem>
    preEffectLayout: Array<SpinSymbol>
    // Not all effects will be serialized. Should design an efficient storage format for effects,
    // because otherwise they take so much
    postEffectLayout: Array<SpinSymbol>
    postEffectItems: Array<SpinItem>
    symbolValues: Array<EarnedValue>
    itemValues: Array<EarnedValue>

    itemsDestroyed: Array<Item>
    symbolsDestroyed: Array<Symbol>
    symbolsRemoved: Array<Symbol>
    symbolsTransformed: Array<Symbol>

    itemsAddedNoChoice: Array<Item>
    symbolsAddedNoChoice: Array<Symbol>
    itemsAddedChoice: Array<Item>
    symbolsAddedChoice: Array<Symbol>
}

export type SpinSymbol = NonArrowSpinSymbol | SpinArrow;

export interface NonArrowSpinSymbol {
    symbol: Symbol
    countdown?: number
    bonus?: number
    multiplier?: number
}

export interface SpinArrow {
    symbol: Symbol.BronzeArrow | Symbol.SilverArrow | Symbol.GoldenArrow,
    direction: ArrowDirections,
    countdown?: number
    bonus?: number
    multiplier?: number
}

export function newSpinSymbol(symbol: Symbol, extras: Extras): SpinSymbol {
    return {
        symbol,
        ...extras.countdown && { countdown: extras.countdown },
        ...extras.bonus && { bonus: extras.bonus },
        ...extras.multiplier && { multiplier: extras.multiplier },
        ...extras.direction && { direction: extras.direction },
    }
}

export function instanceOfSpinSymbol(object: any): object is SpinSymbol {
    return 'symbol' in object;
}

export interface SpinItem {
    item: Item,
    disabled?: boolean
    countdown?: number
}

export function newSpinItem(item: Item, disabled: boolean, countdown?: number | undefined): SpinItem {
    return {
        item,
        ...disabled && { disabled },
        ...countdown && { countdown },
    }
}

export function instanceOfSpinItem(object: any): object is SpinItem {
    return 'item' in object;
}

export interface EarnedValue {
    coins: number
    rerolls?: number
    removals?: number
    essences?: number
}

export function newEarnedValue(coins: number, rerolls: number, removals: number, essences: number): EarnedValue {
    return {
        coins,
        ...!isNaN(rerolls) && { rerolls },
        ...!isNaN(removals) && { removals },
        ...!isNaN(essences) && { essences },
    }
}

export interface Extras {
    countdown?: number
    bonus?: number
    multiplier?: number
    direction?: ArrowDirections
}

export interface LocatedSymbol {
    symbol: Symbol,
    index: number,
}

export interface SymbolStats {
    totalCoins: number,
    totalShows: number,

    // TODO: Should this be only by choice? Or does it not matter
    earliestRentAdded?: number,
    addedByChoice: number,
    addedByEffect: number,

    // This includes when symbols are transformed (coal, chick, etc)
    timesRemovedByEffect: number,
    timesDestroyedByEffect: number,
    // This will not be fully accurate
    timesRemovedByPlayer: number,

    // If it becomes a problem, these can be transmitted a lot more efficiently. However, that is
    // nowhere near the first priority efficiency-wise, so it's fine for now

    // How many times it was added by choice per rent payment (up to 12)
    timesAddedChoiceByRent: Array<number>,
    // The coins added by that symbol 
    coinsByRentPayment: Array<number>,
}

export interface ItemStats {
    earliestRentAdded: number,
    timesAddedNoChoice: number,
    timesAddedByChoice: number,
    timesDestroyed: number,
    timesAddedByRent: number[],
    // This will be interesting for essences and the like
    timesDestroyedByRent: number[],
}


// This will be deleted later
export class SpinInfo {
    symbols: Array<Symbol>;
    values: Array<number>;
    symbolExtras: Array<number | undefined>;

    coinsEarned: number;
    // This is _technically_ redundant
    totalCoins: number;

    symbolsAdded: Array<Symbol>;
    itemsAdded: Array<string>;
    itemsDisabled: Array<string>;

    constructor(earned: number, total: number) {
        this.symbols = [];
        this.values = [];
        this.symbolExtras = [];

        this.symbolsAdded = [];
        this.itemsAdded = [];
        this.itemsDisabled = [];

        this.coinsEarned = earned;
        this.totalCoins = total;
    }
}