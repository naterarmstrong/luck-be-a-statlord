import { Symbol } from "./symbol";

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
    spins: SpinInfo[];
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

// This one should be modified after construction
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