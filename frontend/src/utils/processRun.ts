import { Symbol } from "../common/models/symbol"
import { RunInfo, RunDetails, SpinData } from "../common/models/run"
import { Item } from "../common/models/item";
import { sha256 } from 'hash.js';
import parseSpin from "./parseSpin";

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
export const RENT_F20_SPINS = {
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
    let rentsPaid = 0;
    let lastCoinTotal = 1;

    const details = new RunDetails();

    let earlySyms: Array<Symbol> = [];
    let midSyms: Array<Symbol> = [];
    let lateSyms: Array<Symbol> = [];

    for (const [idx, spinText] of spins.slice(1).entries()) {
        if (isVictory && idx !== spins.length - 2) {
            // Don't bother processing guillotine runs in the middle. Just skip to the last spin to
            // display

            // Set this to an arbitrarily high value so that unlimited runs will not record anything
            // into the symbol details
            rentsPaid = 100;
            continue;
        }

        const spinData = parseSpin(spinText, version);
        if (spinData === null) {
            console.error("Failed to parse spin");
            break;
        }

        isVictory ||= spinData.victory;
        isFloor20 &&= couldBeFloor20(spinData);
        if (!isFloor20) {
            details.markNotFloor20();
        }
        if (spinData.postEffectItems.find((v) => v.item === Item.GuillotineEssence) !== undefined && spinData.coinTotal > 1000000000) {
            isGuillotine = true;
        }

        if (spinData.currentCoins + 20 < lastCoinTotal) {
            rentsPaid += 1;
        }
        lastCoinTotal = spinData.coinTotal;

        const curRentsPaid = rentsPaid;
        spinData.symbolsAddedChoice.forEach((symbol: Symbol) => details.recordSymbolAdded(curRentsPaid, symbol, true));
        spinData.symbolsAddedNoChoice.forEach((symbol: Symbol) => details.recordSymbolAdded(curRentsPaid, symbol, false));
        spinData.symbolsDestroyed.forEach((symbol: Symbol) => details.recordSymbolDestroyed(curRentsPaid, symbol));
        spinData.symbolsRemoved.forEach((symbol: Symbol) => details.recordSymbolRemoved(curRentsPaid, symbol));
        spinData.symbolsTransformed.forEach((symbol: Symbol) => details.recordSymbolRemoved(curRentsPaid, symbol));

        spinData.itemsAddedChoice.forEach((item: Item) => details.recordItemAdded(curRentsPaid, item, true));
        spinData.itemsAddedNoChoice.forEach((item: Item) => details.recordItemAdded(curRentsPaid, item, false));
        spinData.itemsDestroyed.forEach((item: Item) => details.recordItemDestroyed(curRentsPaid, item));

        for (let i = 0; i < 20; i++) {
            // Attribute the coins to the symbol that was there at the start of the spin. This does
            // a better job at capturing the coins from chests, thieves, etc
            details.recordSymbol(rentsPaid, spinData.preEffectLayout[i].symbol, spinData.symbolValues[i].coins);

            // TODO: track last appearances like below
            // Can keep track of how many spins since a symbol was last seen, and say that it was
            // _probably_ removed if it hasn't been seen in ~3 spins. Won't work for items with 3+
            // copies, but eh whatever
        }

        details.spins.push(spinData);

        if (spinData.number === 30) {
            earlySyms = details.getBest3Symbols();
        } else if (spinData.number === 60) {
            midSyms = details.getBest3Symbols();
        }
    }

    lateSyms = details.getBest3Symbols();
    details.endRecording();


    const run = new RunInfo(hash, runNumber, version, isFloor20, date, finishDate - date, isVictory, isGuillotine, spins.length - 1, earlySyms, midSyms, lateSyms);
    run.details = details;

    return run;
}

// Returns false if that spin could not have occurred on floor 20. Returns true otherwise.
// That check consists of looking for:
//  - 3 duds on spin 0
//  - dud added on spin 15
//  - 3 fine print added by landlord (not implemented yet)
function couldBeFloor20(spinData: SpinData): boolean {
    if (spinData.number === 0) {
        const dudCount = spinData.preEffectLayout.map((ss) => ss.symbol).filter((s) => s === Symbol.Dud).length;
        if (dudCount !== 3) {
            return false;
        }
    }
    if (spinData.number === 14) {
        return spinData.symbolsAddedNoChoice.includes(Symbol.Dud);
    }

    return true;
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