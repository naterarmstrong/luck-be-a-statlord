import { Symbol } from "./symbol";

// Rename to RunSummary?
export class RunInfo {
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
    spins: SpinInfo[];
    // Aggregated information on the coins earned per symbol
    coinsPerSymbol: Map<Symbol, number>;
    // How many times symbols appeared in total
    showsPerSymbol: Map<Symbol, number>;


    constructor() {
        this.spins = [];
        this.coinsPerSymbol = new Map();
        this.showsPerSymbol = new Map();
    }

    recordSymbol(symbol: Symbol, value: number) {
        this.showsPerSymbol.set(symbol, (this.showsPerSymbol.get(symbol) ?? 0) + 1);
        this.coinsPerSymbol.set(symbol, (this.coinsPerSymbol.get(symbol) ?? 0) + value);
    }
}

// This one should be modified after construction
export class SpinInfo {
    symbols: Array<Symbol>;
    values: Array<number>;

    coinsEarned: number;
    // This is _technically_ redundant
    totalCoins: number;

    symbolsAdded: Array<Symbol>;
    itemsAdded: Array<string>;
    itemsDisabled: Array<string>;

    constructor(earned: number, total: number) {
        this.symbols = [];
        this.values = [];

        this.symbolsAdded = [];
        this.itemsAdded = [];
        this.itemsDisabled = [];

        this.coinsEarned = earned;
        this.totalCoins = total;
    }
}