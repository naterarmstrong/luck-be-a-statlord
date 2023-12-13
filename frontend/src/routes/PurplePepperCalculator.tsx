import { Button, Grid, TextField, Typography } from "@mui/material";
import SymImg from "../components/SymImg";
import { Symbol } from "../common/models/symbol";
import { Item } from "../common/models/item";
import { useState } from "react";
import React from "react";

let true_classes = new Map<string, number>();

const classify_trues = (trues: Array<number>) => {
    trues.sort((a, b) => a - b);
    let pairs = trues.map((x) => [x % 5, Math.floor(x / 5)]);
    let minX = Math.min(...(pairs.map(([x, y]) => x)))
    let minY = Math.min(...(pairs.map(([x, y]) => y)))
    pairs = pairs.map(([x, y]) => [x - minX, y - minY]);

    let s = "";
    for (let i = 0; i < 9; i++) {
        let xI = i % trues.length;
        let yI = Math.floor(i / trues.length);
        if (pairs.map((a) => a.join("")).includes([xI, yI].join(""))) {
            s += "X";
        } else {
            s += "O";
        }

        if (i % trues.length == trues.length - 1) {
            s += "\n";
        }
    }

    true_classes.set(s, (true_classes.get(s) ?? 0) + 1)
}

const shuffle = (duplicates: number, count: number): Array<boolean> => {
    const a: Array<boolean> = [];
    for (let i = 0; i < duplicates; i++) {
        a.push(true);
    }
    for (let i = 0; i < (count - duplicates); i++) {
        a.push(false);
    }

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }

    return a.slice(0, 20);
}

const generateAllWith3 = (): Array<Array<boolean>> => {
    let boards = [];
    for (let i = 0; i < 20; i++) {
        for (let j = i + 1; j < 20; j++) {
            for (let k = j + 1; k < 20; k++) {
                let board = [];
                for (let l = 0; l < 20; l++) {
                    board.push(i == l || j == l || k == l ? true : false);
                }
                boards.push(board);
            }
        }
    }

    return boards;
}

const generateAllWith4 = (): Array<Array<boolean>> => {
    let boards = [];
    for (let i = 0; i < 20; i++) {
        for (let j = i + 1; j < 20; j++) {
            for (let k = j + 1; k < 20; k++) {
                for (let l = k + 1; l < 20; l++) {
                    let board = [];
                    for (let m = 0; m < 20; m++) {
                        board.push(i == m || j == m || k == m || l == m ? true : false);
                    }
                    boards.push(board);
                }
            }
        }
    }

    return boards;
}

const printBoard = (nums: Array<boolean>, success: boolean) => {
    const symbol = (s: boolean): string => {
        return s ? "X" : "O"
    }
    console.log(`Triggered: ${String(success)}`)
    let boardString = "";
    for (let y = 0; y < 4; y++) {
        let xs = [0, 1, 2, 3, 4];
        boardString += `    ${xs.map((x) => symbol(nums[5 * y + x])).join("")}\n`;
    }
    console.log(boardString)
}

// Returns the list of adjacent indices
const adjacentIdxs = (idx: number): Array<number> => {
    let adjacencies = [];
    const x = idx % 5;
    const y = Math.floor(idx / 5);
    for (let dx = -1; dx < 2; dx++) {
        for (let dy = -1; dy < 2; dy++) {
            let nx = x + dx;
            let ny = y + dy;
            if (nx >= 0 && nx < 5 && ny >= 0 && ny < 4) {
                adjacencies.push(ny * 5 + nx);
            }
        }
    }
    return adjacencies;
}

// Returns true if there are 3 or more 'true' values adjacent in nums, where nums represents a 4x5
// matrix in row-major order
const isSuccess = (nums: Array<boolean>): boolean => {
    let q: Array<number> = [];
    let seen = new Set<number>();
    let cons_true = 0;
    let trues = [];
    for (let i = 0; i < 20; i++) {
        if (seen.has(i)) {
            continue;
        }
        q.push(i);
        while (q.length != 0) {
            const idx = q.pop()!;
            seen.add(idx);
            if (nums[idx]) {
                cons_true += 1;
                trues.push(idx);
                q.push(...adjacentIdxs(idx).filter((x) => !seen.has(x)));
            }
            if (cons_true >= 3) {
                return true;
            }
        }
        cons_true = 0;
        trues = [];
    }
    return false;
}

const PurplePepperCalculator: React.FC = () => {
    const [duplicates, setDuplicates] = useState<number>(3);
    const [total, setTotal] = useState<number>(20);
    const [trials, setTrials] = useState<number>(100000);
    const [odds, setOdds] = useState<number | undefined>(undefined);

    const calculate = () => {
        let triggers = 0;
        for (let i = 0; i < trials; i++) {
            const shuffled = shuffle(duplicates, Math.max(total, 20));
            const success = isSuccess(shuffled);
            if (success) {
                triggers += 1;
            }
        }

        // console.log(generateAllWith4().length);
        // console.log(generateAllWith4().filter((b) => isSuccess(b)).length);
        // for (const key of true_classes.keys()) {
        //     console.log(`${key}    Count: ${true_classes.get(key)}`)
        // }

        setOdds(triggers / trials);
    }

    return (<Grid container alignItems="center" justifyContent="center">
        <Grid item xs={12}>
            <Typography variant="h3">
                <SymImg tile={Item.PurplePepper} size={120} style={{ marginBottom: -30 }} />
                Purple Pepper Calculator
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="h6">
                Find the odds of purple pepper triggering
            </Typography>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={2} alignItems={"end"} justifySelf={"end"}>
            <TextField
                label="Number of Duplicates"
                variant="outlined"
                type="number"
                value={duplicates}
                onChange={(e) => setDuplicates(e.target.value as any)} />
        </Grid>
        <Grid item xs={2}>
            <TextField
                label="Number of Symbols"
                variant="outlined"
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value as any)} />
        </Grid>
        <Grid item xs={2}>
            <TextField
                label="Number of Trials"
                variant="outlined"
                type="number"
                value={trials}
                onChange={(e) => setTrials(e.target.value as any)} />
        </Grid>
        <Grid item xs={2}>
            <Button variant="outlined" onClick={calculate}>
                Calculate
            </Button>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={3} />
        <Grid item xs={6}>
            {odds !== undefined ? <React.Fragment>
                <Typography variant="h3">
                    {(100 * odds).toFixed(2)}% Chance
                </Typography>
                <Typography variant="h3">
                    {(5 * odds).toFixed(2)}<SymImg tile={Symbol.Coin} size={60} style={{ marginBottom: -12 }} /> per spin
                </Typography>
            </React.Fragment> : null}
        </Grid>
        <Grid item xs={3} />
    </Grid>)
}

export default PurplePepperCalculator;