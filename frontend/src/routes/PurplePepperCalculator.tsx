import { Button, Grid, TextField, Typography } from "@mui/material";
import SymImg from "../components/SymImg";
import { Symbol } from "../common/models/symbol";
import { Item } from "../common/models/item";
import { shuffle, adjacentIdxs } from "../utils/simulate";
import { useState } from "react";
import React from "react";

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
        while (q.length !== 0) {
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

    return (<Grid container alignItems="center" justifyContent="center" minHeight="100vh">
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