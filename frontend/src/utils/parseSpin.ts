import { dir } from "console";
import { ArrowDirections, Symbol, SymbolUtils } from "../common/models/symbol";
import { IIDToSymbol, IID_TO_SYMBOL } from "./symbol";
import { Item } from "../common/models/item";
import { IIDToItem } from "./item";

interface SpinSymbol {
    symbol: Symbol
    countdown?: number
    bonus?: number
    multiplier?: number
    direction?: ArrowDirections
}

function newSpinSymbol(symbol: Symbol, extras: Extras): SpinSymbol {
    return {
        symbol,
        ...extras.countdown && { countdown: extras.countdown },
        ...extras.bonus && { bonus: extras.bonus },
        ...extras.multiplier && { multiplier: extras.multiplier },
        ...extras.direction && { direction: extras.direction },
    }
}

interface SpinItem {
    item: Item,
    countdown?: number
}

function newSpinItem(item: Item, extras: Extras): SpinItem {
    return {
        item,
        ...extras.countdown && { countdown: extras.countdown },
        ...extras.bonus && { bonus: extras.bonus },
        ...extras.multiplier && { multiplier: extras.multiplier },
    }
}

interface EarnedValue {
    coins: number
    rerolls?: number
    removals?: number
    essences?: number
}

function newEarnedValue(coins: number, rerolls: number, removals: number, essences: number): EarnedValue {
    return {
        coins,
        ...!isNaN(rerolls) && { rerolls },
        ...!isNaN(removals) && { removals },
        ...!isNaN(essences) && { essences },
    }
}

interface Extras {
    countdown?: number
    bonus?: number
    multiplier?: number
    direction?: ArrowDirections
}

interface Effect {
    source: Item | LocatedSymbol,
    effect: any,
}

interface LocatedSymbol {
    symbol: Symbol,
    index: number,
}


class SpinTextEndedError extends Error { }

enum DebugLevel {
    None,
    Custom,
    Error,
    Trace,
}

// Parse the text of a single spin which is split so the spin number is the start of the string.
// Errors if the spin was ended in the middle of the spin
//
// Spin information follows the following order:
// 1. current coins
// 2. OPTIONAL - fine print
// 3. Spin layout before effects
// 4. Items before effects
// 5a. OPTIONAL, repeats - Effects
// 5b. OPTIONAL, repeats - Symbols or items added
// 6. Spin layout after effects
// 7. Symbol values after effects
// 8. Items after effects
// 9. Item values after effects
// 10. Destroyed symbols
// 11. Destroyed items
// 12. Gained coins
// 13. Coin total
// 14. OPTIONAL - victory
// 15a. Added symbols or Skipped symbols (optional if VICTORY)
// 15b. OPTIONAL - Added item
export function parseSpin(spinText: string) {
    const DEBUG = DebugLevel.Trace;
    // Trim off the date from the start of each line
    // The date is formatted as:
    // [MM/DD/YYYY HH:MM:SS] CONTENT
    // which is 22 characters long
    const lines = spinText.split("\n").map((s, i) => i > 0 ? s.split(" ").slice(2).join(" ") : s);
    const sp = new SpinParser(lines, DEBUG);

    const spinNum = sp.getSpinNumber();
    const coinsBefore = sp.getCoinsBefore();
    const finePrint = sp.getFinePrint();
    const symbols = sp.getPreSpinSymbols();
    const items = sp.getPreSpinItems();
    const effects = [];
    const midEffectItems = [];
    const midEffectSymbols = [];

    // From here, it is possible for the player to quit at any point. `st.readLine` will throw the
    // error
    try {
        // TODO: Extend this loop to catch mid-effect symbol and item additions
        while (!sp.isPostSpinLayout()) {
            if (sp.isEffect()) {
                effects.push(sp.getEffect());
            } else {
                // Skip items/symbols added mid-spin for now
                sp.readLine();
            }
        }
        sp.getPostSpinSymbols();
        sp.getSymbolValues();

    } catch (error) {
        if (error instanceof SpinTextEndedError) {
            console.error("Quit mid-spin.")
            return;
        }
        throw error;
    }

}

const spinLineRegex = /\[(\w+ ?(?:\([^\)]*\))?), (\w+ ?(?:\([^\)]*\))?), (\w+ ?(?:\([^\)]*\))?), (\w+ ?(?:\([^\)]*\))?), (\w+ ?(?:\([^)]*\))?)\]/;
const valueLineRegex = /\[(-?\w+), (-?\w+), (-?\w+), (-?\w+), (-?\w+)\]/

class SpinParser {
    lines: Array<string>
    lineIdx: number
    // Whether or not to print detailed debug output on the parsing of the spin
    debug: DebugLevel

    constructor(lines: Array<string>, debug: DebugLevel) {
        this.lines = lines;
        this.lineIdx = 0;
        this.debug = debug;
    }

    getSpinNumber(): number {
        // 0th line is split so the number is the first thing. Use | to indicate the split
        // [DATE] --- SPIN #|123 ---
        const spinNum = Number(this.readLine().split(" ")[0]);
        if (isNaN(spinNum)) {
            throw new Error(`Failed to detect spin number from text: ${this.lines[this.lineIdx - 1]}`);
        }
        if (this.isTrace()) {
            console.log(`Spin number ${spinNum}`);
        }
        return spinNum;
    }

    getCoinsBefore(): number {
        const coinsBeforeMatch = this.readLine().match("Currently have ([0-9]*) coins")?.[1];
        if (!coinsBeforeMatch || isNaN(Number(coinsBeforeMatch))) {
            throw new Error(`Failed to detect spin number from text: ${this.lines[this.lineIdx - 1]}`);
        }
        return Number(coinsBeforeMatch);
    }

    getFinePrint(): Array<number> | null {
        const finePrintMatch = this.peek().match("Fine print is: (.*)")
        if (!finePrintMatch) {
            return null;
        } else {
            this.readLine();
        }
        const finePrint = JSON.parse(finePrintMatch[1]);
        if (this.isTrace()) {
            console.log("finePrint", finePrint);
        }
        return finePrint;
    }

    getPreSpinSymbols(): Array<SpinSymbol> {
        const headerLine = this.readLine()
        if (this.isError()) {
            const spinLayoutMatch = headerLine.match("Spin layout before effects is:");
            if (!spinLayoutMatch) {
                console.log(`Could not find pre effects layout heading on line.`, headerLine)
            }
        }

        const symbolTexts = this.getSymbolTexts();
        const spinSymbols = symbolTexts.map((s) => this.parseSymbol(s));

        if (this.isTrace()) {
            console.log(spinSymbols);
        }

        return spinSymbols;
    }

    getPreSpinItems(): Array<SpinItem> {
        const headerLine = this.readLine()
        if (this.isError()) {
            const itemHeaderMatch = headerLine.match("Items before effects are:");
            if (!itemHeaderMatch) {
                console.log(`Could not find pre effects items heading on line.`, headerLine)
            }
        }

        const itemTexts = this.readLine().split("[")[1].split("]")[0].split(',').map((s) => s.trim());
        if (this.isTrace()) {
            console.log("Item texts:", itemTexts)
        }
        if (itemTexts.length === 1 && itemTexts[0] === "") {
            return [];
        }

        const spinItems = itemTexts.map((s) => this.parseItem(s));

        if (this.isTrace()) {
            console.log("Spin Items:", spinItems)
        }

        return spinItems;
    }

    getEffect() {
        this.parseEffect(this.readLine())
    }

    isPostSpinLayout(): boolean {
        return this.peek().startsWith("Spin layout after effects is:");
    }

    getPostSpinSymbols(): Array<SpinSymbol> {
        const headerLine = this.readLine();
        if (this.isError()) {
            if (!headerLine.startsWith("Spin layout after effects is:")) {
                console.log(`Could not find post effects layout heading on line.`, headerLine)
            }
        }

        const symbolTexts = this.getSymbolTexts();
        const spinSymbols = symbolTexts.map((s) => this.parseSymbol(s));

        if (this.isTrace()) {
            console.log(spinSymbols);
        }

        return spinSymbols;
    }

    getSymbolValues(): Array<EarnedValue> {
        const headerLine = this.readLine();
        if (this.isError()) {
            if (!headerLine.startsWith("Symbol values after effects are:")) {
                console.log(`Could not find values heading on line.`, headerLine)
            }
        }

        const valueTexts = [];
        for (let i = 0; i < 4; i++) {
            const valueLine = this.readLine();
            const valueLineMatch = valueLine.match(valueLineRegex);
            if (!valueLineMatch) {
                console.log(`Could not find value layout on line.`, valueLine);
                throw new Error("Failed to see values.")
            }
            valueTexts.push(...valueLineMatch?.slice(1));
        }

        if (this.isTrace()) {
            console.log(`Value texts:`, valueTexts)
        }

        const values = valueTexts.map((s) => this.parseValue(s));

        if (this.isTrace()) {
            console.log(`Values`, values)
        }

        return values;
    }

    isEffect() {
        return this.peek().startsWith("Effect - ");
    }

    // Effects follow the format:
    // Effect - SYMBOL (x:1, y:1): EFFECT_OBJ
    // Effect - ITEM: EFFECT_OBJ
    // Effect objects are like JSON, but without quotations on values
    parseEffect(effectText: string): Effect {
        if (this.isError() && !effectText.startsWith("Effect - ")) {
            console.error(`Malformed effect: ${effectText}`);
        }
        // strip first 9
        const effectOnly = effectText.slice(9);

        var source: Item | LocatedSymbol;
        const effectSource = effectOnly.split(": ")[0];
        const sourceIsSymbol = effectSource.split(" ").length > 1;
        if (sourceIsSymbol) {
            const symbol = IIDToSymbol(effectSource.split(" ")[0]);
            if (this.isError() && symbol == Symbol.Unknown) {
                console.error(`Bad symbol effect source: ${effectSource}`)
                console.error(`    Effect: ${effectText}`)
            }
            const x = Number(effectSource.split(" ")[1][3]);
            const y = Number(effectSource.split(" ")[2][2]);
            const index = y * 5 + x
            if (this.isError() && isNaN(index) || index < 0 || index > 19) {
                console.error(`Bad symbol effect location: ${effectSource}`)
                console.error(`    Effect: ${effectText}`)
            }
            source = { symbol, index };
        } else {
            const item = IIDToItem(effectSource)
            if (this.isError() && item == Item.ItemMissing) {
                console.error(`Bad item effect source: ${effectSource}`)
                console.error(`    Effect: ${effectText}`)
            }
            source = item;
        }

        const effectObjText = effectOnly.split(": ")[1];
        const effect = this.parseEffectObject(effectObjText);
        return { source, effect }
    }

    // The effect object is stored in almost-json, with some awkward constructions or unquoted keys
    // and values
    parseEffectObject(text: string): any {
        // Fix targeting the popups
        const fix1 = text.replace(/\b:(Pop-up|Reels|Item|Slot Icon):\[[^,^}]*\]/gm, ':"$1"');
        // Fix dynamic targeting of specific slot icons
        const fix2 = fix1.replace(/@Slot Icon@[0-9]*:\[[^,^}]*\]/gm, '"Slot Icon"');
        // Fix dynamic targeting of specific items
        const fix3 = fix2.replace(/@Item@[0-9]*:\[[^,^}]*\]/gm, '"Slot Icon"');
        // Fix object values that look like key:value where both should be quoted
        const fix4 = fix3.replace(/\b([a-zA-Z]\w*):([a-zA-Z]\w*)/gm, '"$1":"$2"');
        // Fix keys that look like key:1 where the key needs to be quoted
        const fix5 = fix4.replace(/\b([a-zA-Z]\w*):/gm, '"$1":');
        // Fix arrays of size 1
        const fix6 = fix5.replace(/\[(\w+)\]/gm, '["$1"]');
        // Fix arrays of size 2 and 3
        const fix7 = fix6.replace(/\[(\w+), (\w+)\]/gm, '["$1", "$2"]').replace(/\[(\w+), (\w+), (\w+)\]/gm, '["$1", "$2", "$3"]');

        try {
            return JSON.parse(fix7);
        } catch (error) {
            console.log("Original text", text)
            console.log("New text", fix7)
            console.error("Failed to parse JSON")
            throw error;
        }
    }

    getSymbolTexts(): Array<string> {
        const symbolTexts = [];
        for (let i = 0; i < 4; i++) {
            const symbolLine = this.readLine();
            const symbolLineMatch = symbolLine.match(spinLineRegex);
            if (!symbolLineMatch) {
                console.log(`Could not find spin layout on line.`, symbolLine);
                throw new Error("Failed to see post-spin.")
            }
            symbolTexts.push(...symbolLineMatch?.slice(1));
        }

        if (this.isTrace()) {
            console.log(`Symbol texts:`, symbolTexts);
        }
        return symbolTexts;
    }

    parseSymbol(symbolText: string): SpinSymbol {
        const symOnly = symbolText.split("(")[0].trim();
        const symbol = IIDToSymbol(symOnly);
        if (symbol == Symbol.Unknown && this.isError()) {
            console.error(`Found unknown symbol: ${symOnly}`);
        }

        const extras = this.parseExtras(symbolText);

        return newSpinSymbol(symbol, extras);
    }

    parseItem(itemText: string): SpinItem {
        const itemOnly = itemText.split("(")[0].trim();
        const item = IIDToItem(itemOnly);
        if (item == Item.ItemMissing && this.isError()) {
            console.error(`Found unknown item: ${itemOnly}`)
        }

        const extras = this.parseExtras(itemText);

        return newSpinItem(item, extras)
    }

    parseExtras(symbolOrItemText: string): Extras {
        // Extras look like either
        // pre-effect: SYMBOL (COUNT)
        // post-effect: SYMBOL(COUNT,+BONUS,MULTIPLIERx)
        // Arrows can also have the extra of direction
        const hasExtras = symbolOrItemText.split("(").length > 1;
        if (!hasExtras) {
            return {};
        }

        let countdown: number | undefined = undefined;
        let bonus: number | undefined = undefined;
        let multiplier: number | undefined = undefined;
        let direction: ArrowDirections | undefined = undefined;

        const extras = symbolOrItemText.split("(")[1].split(")")[0].split(",").map((s) => s.trim());
        for (const extra of extras) {
            if (extra.startsWith("+")) {
                bonus = Number(extra.slice(1))
            } else if (extra.endsWith("x")) {
                multiplier = Number(extra.slice(0, -1))
            } else if (!isNaN(Number(extra))) {
                countdown = Number(extra)
            } else if (Object.keys(ArrowDirections).includes(extra)) {
                // There can theoretically be two directions with quiver, but only one of them is
                // displayed, so we capture whichever one appears second in that case
                direction = extra as ArrowDirections;
            } else if (this.isError()) {
                console.log(`Failed to parse symbol extra`, symbolOrItemText, extra)
            }
        }

        if (this.isCustom()) {
            if (bonus && multiplier && countdown) {
                console.error(`Highly marked up symbol or item!`)
                console.error(`   Text: ${symbolOrItemText}`)
            }
        }

        return { countdown, bonus, multiplier, direction }
    }

    parseValue(valueText: string): EarnedValue {
        // Values look like 
        // 12e1v1r1
        // Where:
        // - e is for essence tokens
        // - v is for removal tokens
        // - r is for reroll tokens
        // If the tokens are not present, they will not appear at all
        const valueTextMatches = valueText.match(/(-?[0-9]+)(e[0-9]+)?(v[0-9]+)?(r[0-9]+)?/)
        if (!valueTextMatches || valueTextMatches.length != 5 || !valueTextMatches[0]) {
            console.error(`Failed to parse a value`, valueText)
            throw new Error("Failed to parse value")
        }

        const coins = Number(valueTextMatches[1]);
        const essences = Number(valueTextMatches[2]?.slice(1))
        const removals = Number(valueTextMatches[3]?.slice(1))
        const rerolls = Number(valueTextMatches[4]?.slice(1))

        return newEarnedValue(coins, rerolls, removals, essences);
    }

    peek(): string {
        return this.lines[this.lineIdx]
    }

    readLine(): string {
        if (this.lineIdx >= this.lines.length) {
            throw new SpinTextEndedError();
        }
        return this.lines[this.lineIdx++];
    }

    isError(): boolean {
        return this.debug == DebugLevel.Error || this.debug == DebugLevel.Trace || this.debug == DebugLevel.Custom
    }

    isCustom(): boolean {
        return this.debug == DebugLevel.Custom || this.debug == DebugLevel.Trace
    }

    isTrace(): boolean {
        return this.debug == DebugLevel.Trace
    }
}

export default parseSpin;