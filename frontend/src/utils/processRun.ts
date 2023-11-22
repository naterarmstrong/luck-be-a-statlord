import { v4 } from "uuid";
import { IIDToSymbol, Symbol } from "./symbol";

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

const preSpinSymbolRegex = /Spin layout before effects is:\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,^\n]*)\]/;
const postSpinSymbolRegex = /Spin layout after effects is:\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,^\n]*)\]/;
const spinValuesRegex = /Symbol values after effects are:\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,^\n]*)\]/;

export function processRun(text: string): ProcessedRun {
    // spins[0] is the information before the run starts
    const spins = text.split(/--- SPIN #/);
    const runNumber = Number(spins[0].split('\n')[0].match("--- STARTING RUN #(.*) ---")?.[1]);
    const version = spins[0].split('\n')[1].match("--- (.*) ---")?.[1]!;
    let isVictory = false;
    let isFloor20 = true;

    const cumulativeSymbols = getSymbolAddedMap();
    const coinsPerSymbol = new Map<Symbol, number>();
    const appearancesPerSymbol = new Map<Symbol, number>();

    const start = performance.now();

    for (const spinText of spins.slice(1)) {
        const spinNum = Number(spinText.match("([\\d]*)")?.[1]!);

        const symbols = spinText.match(preSpinSymbolRegex)?.slice(1).map((s) => s.split(" (")[0])!;
        // The final mapping is to ignore cases where something (a capsule) gives a removal token
        // (v), reroll token (r), or essence (e), which is denoted like -12e1. We are only
        // interested in the essence token
        const values = spinText.match(spinValuesRegex)?.slice(1).map((s) => Number(s.split(/[vre]/)[0]))!;

        // Cut these off and calculate at end of early game, midgame, late game.
        // Probably cut at 225 rent, 600 rent, end of game?

        // Note: Would have to keep track of inventory across spins by inferring based off of
        // symbols added, destroyed, removed. However, that is currently impossible because the logs
        // do not include which symbols are removed. They also don't include how many reroll /
        // removal / essence things you have at any given time.


        // TODO: Capturing transformations (coal -> diamond, egg -> chick -> chicken, dog -> wolf) needs to go into effects
        // Looks like value_to_change:type is what transforms symbols. tiles_to_add is when something being destroyed added something else

        //console.log(`Spin number ${spinNum}`);
        //console.log(symbols);
        for (let i = 0; i < 20; i++) {
            const symbolStr = symbols[i];
            const val = values[i];
            const symbol = IIDToSymbol(symbolStr);
            if (symbol === Symbol.Unknown) {
                console.error(`Found unknown symbol: ${symbolStr}`);
            }
            appearancesPerSymbol.set(symbol, (appearancesPerSymbol.get(symbol) ?? 0) + 1);
            coinsPerSymbol.set(symbol, (coinsPerSymbol.get(symbol) ?? 0) + val);
        }

        if (spinText.includes("VICTORY")) {
            isVictory = true;
            // From now on, it's endless mode. Should note that and put endless mode info into
            // a slightly different category
        }

        if (spinNum === 30 || spinNum === 60) {
            const best = (new Array(...coinsPerSymbol.entries())).sort(([, a], [, b]) => b - a).slice(0, 3);
            if (spinNum === 30) {
                console.log(`   Early game stats:`);
            } else if (spinNum === 60) {
                console.log(`   Mid game stats:`);
            }
            for (let i = 0; i < 3; i++) {
                console.log(`       ${best[i][0]}: ${best[i][1]} total, ${best[i][1] / appearancesPerSymbol.get(best[i][0])!} average`);
            }
        }

        //console.log(`Symbol text: ${symbols}`);
        //const symbolList = symbols.split(",").map((s: string) => s.trim());
        //console.log(symbolList);
    }

    const best = (new Array(...coinsPerSymbol.entries())).sort(([, a], [, b]) => b - a).slice(0, 5);


    const end = performance.now();

    console.log(`Run number ${runNumber} on version ${version} in ${end - start}`)
    for (let i = 0; i < 5; i++) {
        console.log(`   ${best[i][0]}: ${best[i][1]} total, ${best[i][1] / appearancesPerSymbol.get(best[i][0])!} average`);
    }

    return new ProcessedRun(runNumber, version, 0, isVictory);
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