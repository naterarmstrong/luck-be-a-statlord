import { v4 } from "uuid";
import { IIDToSymbol, Symbol } from "./symbol";

// Rename to RunSummary?
export class ProcessedRun {
    UUID: string;
    number: number;
    victory: boolean;
    guillotine: boolean;
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

    // Maybe this is in optional run details?
    // So we have run summary, run details, etc
    // runDetails?: RunDetails;
    spins: Array<Symbol[]>;

    constructor(
        number: number,
        version: string,
        date: number,
        duration: number,
        victory: boolean,
        guillotine: boolean,
        earlySyms: Symbol[],
        midSyms: Symbol[],
        lateSyms: Symbol[],
        spins: Array<Symbol[]>
    ) {
        this.UUID = v4();
        this.number = number;
        this.version = version;
        this.date = date;
        this.duration = duration;
        this.victory = victory;
        this.guillotine = guillotine;
        this.earlySyms = earlySyms;
        this.midSyms = midSyms;
        this.lateSyms = lateSyms;
        this.spins = spins;
    }
}

// TODO:
// Run summary, run details, extract view of just uploaded runs into its own component
// Top bar that lets you go to different places
/*

/upload brings you to the upload page. Need to be logged in to upload runs probably
/login brings you to the login/signup page (do I want to even send emails??)
/user/:userid brings you to the user page, where they can show
    - winrate (in runs over 1m or something)
    - number of runs
    - number of guillotines
    - something else? highest winrate something or other?
    - pinned runs (another TODO)
/run/:runid brings you to the run page, which shows
    - run summary at top of page
    - pageable view of all spins, along with tentantive inventory and list of items/essences
/ brings you to the main screen, which shows number of runs uploaded, overall winrate, some random stats

*/

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
    const startDateString = spins[0].split('\n')[0].match(/\[(.*)\]/)?.[1]!;
    const finishDateString = text.split("\n").slice(-2, -1)[0]!.match(/^\[([^\]^\n]*)\]/)?.[1]!;
    const date = parseDate(startDateString);
    const finishDate = parseDate(finishDateString);
    const version = spins[0].split('\n')[1].match("--- (.*) ---")?.[1]!;
    let isVictory = false;
    let isFloor20 = true;
    let isGuillotine = false;

    const cumulativeSymbols = getSymbolAddedMap();
    const coinsPerSymbol = new Map<Symbol, number>();
    const appearancesPerSymbol = new Map<Symbol, number>();
    let earlySyms: Array<Symbol> = [];
    let midSyms: Array<Symbol> = [];
    let lateSyms: Array<Symbol> = [];
    const processedSpins: Array<Symbol[]> = [];

    const start = performance.now();

    for (const spinText of spins.slice(1)) {
        const spinNum = Number(spinText.match("([\\d]*)")?.[1]!);

        const symbolStrs = spinText.match(preSpinSymbolRegex)?.slice(1).map((s) => s.split(" (")[0])!;
        // The final mapping is to ignore cases where something (a capsule) gives a removal token
        // (v), reroll token (r), or essence (e), which is denoted like -12e1. We are only
        // interested in the essence token
        const values = spinText.match(spinValuesRegex)?.slice(1).map((s) => Number(s.split(/[vre]/)[0]))!;

        let symbols: Symbol[] = [];

        // Note: Would have to keep track of inventory across spins by inferring based off of
        // symbols added, destroyed, removed. However, that is currently impossible because the logs
        // do not include which symbols are removed. They also don't include how many reroll /
        // removal / essence things you have at any given time.

        // Can keep track of how many spins since a symbol was last seen, and say that it was
        // _probably_ removed if it hasn't been seen in ~3 spins. Won't work for items with 3+
        // copies, but eh whatever


        // TODO: Capturing transformations (coal -> diamond, egg -> chick -> chicken, dog -> wolf) needs to go into effects
        // Looks like value_to_change:type is what transforms symbols. tiles_to_add is when something being destroyed added something else

        //console.log(`Spin number ${spinNum}`);
        //console.log(symbols);
        for (let i = 0; i < 20; i++) {
            const symbolStr = symbolStrs[i];
            const val = values[i];
            const symbol = IIDToSymbol(symbolStr);
            if (symbol === Symbol.Unknown) {
                console.error(`Found unknown symbol: ${symbolStr}`);
            }
            appearancesPerSymbol.set(symbol, (appearancesPerSymbol.get(symbol) ?? 0) + 1);
            coinsPerSymbol.set(symbol, (coinsPerSymbol.get(symbol) ?? 0) + val);
            symbols.push(symbol);
        }

        if (!isVictory) {
            // Skip keeping track of every single board once going for endless / guillotine essence
            processedSpins.push(symbols);
        }

        if (spinText.includes("VICTORY")) {
            isVictory = true;
            // From now on, it's endless mode. Should note that and put endless mode info into
            // a slightly different category
        }

        if (spinNum === 30 || spinNum === 60) {
            const best = (new Array(...coinsPerSymbol.entries())).sort(([, a], [, b]) => b - a).slice(0, 3);

            if (spinNum === 30) {
                earlySyms = best.map(x => x[0]);
                console.log(`   Early game stats:`);
            } else if (spinNum === 60) {
                midSyms = best.map(x => x[0]);
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

    let guillotineMatches = text.split("\n").slice(-2, -1)[0]!.match(/Coin total is now ([\d]*) after spinning/);
    if (guillotineMatches != null && guillotineMatches.length == 2 && Number(guillotineMatches[1]) > 1000000000) {
        isGuillotine = true;
    }

    const end = performance.now();
    console.log(`Run number ${runNumber} on version ${version} in ${end - start}`)

    const best = (new Array(...coinsPerSymbol.entries())).sort(([, a], [, b]) => b - a).slice(0, 3);
    lateSyms = best.map(x => x[0]);
    for (let i = 0; i < 3; i++) {
        console.log(`   ${best[i][0]}: ${best[i][1]} total, ${best[i][1] / appearancesPerSymbol.get(best[i][0])!} average`);
    }

    return new ProcessedRun(runNumber, version, date, finishDate - date, isVictory, isGuillotine, earlySyms, midSyms, lateSyms, processedSpins);
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

// Parses a LBaL date and returns the approximate unix timestamp
// Assumes the date takes the form MM/DD/YYYY HH:MM:SS
// TODO: Is this consistent across all players? 
function parseDate(dateString: string): number {
    const dateParts = dateString.split(" ");
    const largeParts = dateParts[0].split("/");
    const smallParts = dateParts[1].split(":");
    const month = Number(largeParts[0]);
    const day = Number(largeParts[1]);
    const year = Number(largeParts[2]);
    const hour = Number(smallParts[0]);
    const minute = Number(smallParts[1]);
    const second = Number(smallParts[2]);
    const date = new Date(year, month - 1, day, hour, minute, second);
    return date.getTime();
}

export function msToTime(ms: number): string {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (Number(seconds) < 60) return seconds + " Sec";
    else if (Number(minutes) < 60) return minutes + " Min";
    else if (Number(hours) < 24) return hours + " Hrs";
    else return days + " Days"
}