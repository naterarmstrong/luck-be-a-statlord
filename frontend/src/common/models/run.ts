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


    constructor() {
        this.spins = [];
        this.coinsPerSymbol = new Map();
        this.showsPerSymbol = new Map();
        this.firstShowPerSymbol = new Map();
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
    symbolsTransformed: Array<Symbol>

    itemsAddedNoChoice: Array<Item>
    symbolsAddedNoChoice: Array<Symbol>
    itemsAddedChoice: Array<Item>
    symbolsAddedChoice: Array<Symbol>
}

export interface SpinSymbol {
    symbol: Symbol
    countdown?: number
    bonus?: number
    multiplier?: number
    direction?: ArrowDirections
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