import { v4 } from "uuid";

export class ProcessedRun {
    UUID: string;
    number: number;
    victory: boolean;
    // The unix timestamp of the run's completion
    date: number;
    // The version of luck be a landlord. Should this be 3 numbers?? or only major version?
    version: string;

    constructor(number: number, version: string, date: number, victory: boolean) {
        this.UUID = v4();
        this.number = number;
        this.version = version;
        this.date = date;
        this.victory = victory;
    }
}

export class SpinInfo {
    // TODO: how to handle doubles??
    coinsPerSymbol: Map<string, number>;
    // eaters eating happens later
    coinsEarned: number;
    // This is _technically_ redundant
    totalCoins: number;
    symbolsAdded: Array<string>;
    itemsAdded: Array<string>;
    itemsDisabled: Array<string>;

    constructor(coinsEarned: number, totalCoins: number) {
        this.coinsPerSymbol = new Map();
        this.symbolsAdded = [];
        this.itemsAdded = [];
        this.itemsDisabled = [];

        this.totalCoins = totalCoins;
        this.coinsEarned = coinsEarned;
    }
}

/*
- coins per symbol
- perma-eaters that ate
- single-eaters that ate
- total coins earned
- total coins after spin
- coins per symbol (rough first)
- symbol(s) added
- item(s) added
- which items were disabled ?
- max coins earned in a spin, which symbol
*/

// The spin count on which, and the amount which is due on each rent payment. Note that this might
// end up incorrect due to comfy pillow / comfy pillow essence / coffee cup / coffee cup essence.
const RENT_F20_SPINS = {
    5: 25,
    10: 50,
    16: 100,
    22: 150,
    29: 225,
    36: 300,
    44: 375,
    52: 450,
    61: 600,
    70: 650,
    80: 700,
    90: 777,
    100: 1000,
    110: 1500,
    120: 2000,
}

export function processRun(text: string): ProcessedRun {
    // spins[0] is the information before the run starts
    const spins = text.split(/--- SPIN #/);
    const runNumber = Number(spins[0].split('\n')[0].match("--- STARTING RUN #(.*) ---")?.[1]);
    const version = spins[0].split('\n')[1].match("--- (.*) ---")?.[1]!;
    let isFloor20 = true;

    for (const spinText of spins.slice(1)) {
        const spinNum = spinText.match("([\\d]*)")?.[1]!;
        console.log(`Spin number ${spinNum}`);
    }

    console.log(`Run number ${runNumber} on version ${version}`)

    return new ProcessedRun(runNumber, version, 0, true);
}