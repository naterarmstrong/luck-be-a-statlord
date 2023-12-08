import { v4 } from "uuid";
import { IIDToSymbol } from "./symbol";
import { Symbol } from "../common/models/symbol"
import { RunInfo, RunDetails, SpinInfo } from "../common/models/run"
import { Item } from "./item";
import { sha256 } from 'hash.js';

/*
Thing to record:

- DONE(ish) coins per symbol
- perma-eaters that ate
- single-eaters that ate
- DONE total coins earned
- DONE total coins after spin
- symbol(s) added
- item(s) added
- which items were disabled ?
- max coins earned in a spin, which symbol
*/

// The spin count on which, and the amount which is due on each rent payment. Note that this might
// end up incorrect due to comfy pillow / comfy pillow essence / coffee cup / coffee cup essence.
const RENT_F20_SPINS = {
    5: 25, // Rent 1
    10: 50, // Rent 2
    16: 100, // Rent 3
    22: 150, // Rent 4
    29: 225, // Rent 5
    36: 300, // Rent 6
    44: 375, // Rent 7
    52: 450, // Rent 8
    61: 600, // Rent 9
    70: 650, // Rent 10
    80: 700, // Rent 11
    90: 777, // Rent 12
    100: 1000, // Rent 13 - first landlord rent
    110: 1500, // Rent 14 - second landlord rent
    120: 2000, // Rent 15 - third landlord rent
}

const preSpinSymbolRegex = /Spin layout before effects is:\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,^\n]*)\]/;
const postSpinSymbolRegex = /Spin layout after effects is:\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,^\n]*)\]/;
const spinValuesRegex = /Symbol values after effects are:\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,]*)\]\n\[[^\]]*\] \[([^,]*), ([^,]*), ([^,]*), ([^,]*), ([^,^\n]*)\]/;
const coinsGainedRegex = /Gained (-?[\d]*) coins this spin/;
const coinTotalRegex = /Coin total is now (-?[\d]*) after spinning/;
const addedSymbolsRegex = /Added symbols: \[([^\^\n]*)\]/g

export function processRun(text: string): RunInfo {
    if (text === "" || !text) {
        throw new Error("Empty run file")
    }

    const hash = sha256().update(text).digest('hex');

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
    const details = new RunDetails();

    const logRuns = false;

    // Keeps track of inventory
    const cumulativeSymbols = getSymbolAddedMap();

    let earlySyms: Array<Symbol> = [];
    let midSyms: Array<Symbol> = [];
    let lateSyms: Array<Symbol> = [];

    const start = performance.now();

    for (const spinText of spins.slice(1)) {
        const spinNum = Number(spinText.match("([\\d]*)")?.[1]!);

        const symbolExtras = spinText.match(preSpinSymbolRegex)?.slice(1).map((s) => s.split(" ")[1]);
        const symbolStrs = spinText.match(preSpinSymbolRegex)?.slice(1).map((s) => s.split(" (")[0])!;
        // The final mapping is to ignore cases where something (a capsule) gives a removal token
        // (v), reroll token (r), or essence (e), which is denoted like -12e1. We are only
        // interested in the essence token
        const values = spinText.match(spinValuesRegex)?.slice(1).map((s) => Number(s.split(/[vre]/)[0]))!;
        const symbolsAdded = Array.from(spinText.matchAll(addedSymbolsRegex), (m) => m[1]).flatMap((x) => x.split(',')).map((x) => IIDToSymbol(x));

        const coinsGainedMatch = spinText.match(coinsGainedRegex);
        const coinsTotalMatch = spinText.match(coinTotalRegex);

        // This can happen if you quit the game mid-spin, while effects are ongoing
        if (!values || values.length < 20 || !symbolStrs || symbolStrs.length < 20 || !coinsGainedMatch || !coinsTotalMatch || coinsGainedMatch.length < 2 || coinsTotalMatch.length < 2 || !symbolExtras) {
            console.error(`Quit mid-spin during spin ${spinNum}`);
            break;
        }

        const coinsEarned = Number(coinsGainedMatch[1])
        const coinsTotal = Number(coinsTotalMatch[1])

        const spinInfo = new SpinInfo(coinsEarned, coinsTotal);
        spinInfo.symbolsAdded = symbolsAdded;

        // Note: Would have to keep track of inventory across spins by inferring based off of
        // symbols added, destroyed, removed. However, that is currently impossible because the logs
        // do not include which symbols are removed. They also don't include how many reroll /
        // removal / essence things you have at any given time.

        // Can keep track of how many spins since a symbol was last seen, and say that it was
        // _probably_ removed if it hasn't been seen in ~3 spins. Won't work for items with 3+
        // copies, but eh whatever


        // TODO: Capturing transformations (coal -> diamond, egg -> chick -> chicken, dog -> wolf) needs to go into effects
        // Looks like value_to_change:type is what transforms symbols. tiles_to_add is when something being destroyed added something else
        // Also, later, capturing value multipliers should be added to the main symbols probably

        // console.log(`Spin number ${spinNum}`);
        //console.log(symbols);
        for (let i = 0; i < 20; i++) {
            const symbolStr = symbolStrs[i];
            const symbol = IIDToSymbol(symbolStr);
            if (symbol === Symbol.Unknown) {
                console.error(`Found unknown symbol: ${symbolStr}`);
            }
            details.recordSymbol(symbol, values[i]);
            spinInfo.symbols.push(symbol);
            spinInfo.values.push(values[i]);
            let symbolExtra = undefined;
            if (symbolExtras[i]) {
                const maybeNumber = Number(symbolExtras[i].slice(1, symbolExtras[i].length - 1));
                if (!isNaN(maybeNumber)) {
                    symbolExtra = maybeNumber;
                }
            }
            spinInfo.symbolExtras.push(symbolExtra);
        }

        if (!isVictory) {
            // Skip keeping track of every single board once going for endless / guillotine essence
            details.spins.push(spinInfo);
            // TODO: Also push last spin if it is a guillotine essence win..
        }

        if (spinText.includes("VICTORY")) {
            isVictory = true;
            // From now on, it's endless mode. Should note that and put endless mode info into
            // a slightly different category
        }

        if (spinNum === 30 || spinNum === 60) {
            const best = (new Array(...details.coinsPerSymbol.entries())).sort(([, a], [, b]) => b - a).slice(0, 3);

            if (spinNum === 30) {
                earlySyms = best.map(x => x[0]);
                logRuns && console.log(`   Early game stats:`);
            } else if (spinNum === 60) {
                midSyms = best.map(x => x[0]);
                logRuns && console.log(`   Mid game stats:`);
            }
            for (let i = 0; i < 3; i++) {
                logRuns && console.log(`       ${best[i][0]}: ${best[i][1]} total, ${best[i][1] / details.showsPerSymbol.get(best[i][0])!} average`);
            }
        }
    }

    if (text.includes("guillotine_essence") && Array(...details.coinsPerSymbol.values()).reduce((a, b) => a + b, 0) > 1000000000) {
        isGuillotine = true;
    }

    const end = performance.now();
    logRuns && console.log(`Run number ${runNumber} on version ${version} in ${end - start}`)

    const best = (new Array(...details.coinsPerSymbol.entries())).sort(([, a], [, b]) => b - a).slice(0, 3);
    lateSyms = best.map(x => x[0]);
    for (let i = 0; i < 3; i++) {
        logRuns && console.log(`   ${best[i][0]}: ${best[i][1]} total, ${best[i][1] / details.showsPerSymbol.get(best[i][0])!} average`);
    }


    const run = new RunInfo(hash, runNumber, version, date, finishDate - date, isVictory, isGuillotine, spins.length - 1, earlySyms, midSyms, lateSyms);
    run.details = details;

    return run;
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