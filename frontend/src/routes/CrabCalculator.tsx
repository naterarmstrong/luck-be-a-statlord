import { Button, Grid, TextField, Typography } from "@mui/material";
import SymImg from "../components/SymImg";
import { Symbol } from "../common/models/symbol";
import { Item } from "../common/models/item";
import { shuffle } from "../utils/simulate";
import { useState } from "react";
import React from "react";

// Returns the number of rows with 0-5 crabs
const getCrabCounts = (nums: Array<boolean>): Array<number> => {
    // Get crab counts
    let ret = [0, 0, 0, 0, 0, 0]
    for (let i = 0; i < 4; i++) {
        let count = nums.slice(5 * i, 5 * i + 5).filter((x) => x).length;
        ret[count] += 1;
    }

    return ret;
}

const coinsFromCounts = (counts: Array<number>): number => {
    let total = 0;
    for (let i = 0; i < 6; i++) {
        total += i * (1 + 3 * (i - 1)) * counts[i];
    }
    return total
}

// Return the numbers from 1-x that are 5 or less
const numberToRange = (x: number): Array<number> => {
    const out = [];
    for (let i = 1; i <= Math.min(5, x); i++) {
        out.push(i);
    }
    return out;
}

const CrabCalculator: React.FC = () => {
    const [crabs, setCrabs] = useState<number>(3);
    const [total, setTotal] = useState<number>(20);
    const [trials, setTrials] = useState<number>(100000);
    const [lineOdds, setLineOdds] = useState<Array<number> | undefined>(undefined);
    const [spinOdds, setSpinOdds] = useState<Array<number> | undefined>(undefined);
    const [coinTotal, setCoinTotal] = useState<number | undefined>(undefined);
    const [calcCrabs, setCalcCrabs] = useState<number>(0);

    const calculate = () => {
        // The number of lines that have 0-5 crabs
        const lineCounts = [0, 0, 0, 0, 0, 0]
        // The number of _trials_ that have a line with at least X crabs
        const highestCounts = [0, 0, 0, 0, 0, 0]

        let totalCoins = 0;
        for (let i = 0; i < trials; i++) {
            const shuffled = shuffle(crabs, Math.max(total, 20));
            const trialCounts = getCrabCounts(shuffled);
            totalCoins += coinsFromCounts(trialCounts);
            for (let i = 0; i < 6; i++) {
                lineCounts[i] += trialCounts[i];
            }
            for (let i = 5; i >= 0; i--) {
                if (trialCounts[i] > 0) {
                    highestCounts[i] += 1;
                    break;
                }
            }
        }

        console.log(lineCounts);
        console.log(highestCounts);

        setLineOdds(lineCounts.map((x) => x / (4 * trials)));
        setSpinOdds(highestCounts.map((x) => x / trials))
        setCoinTotal(totalCoins / (trials * Math.min(crabs, 20)));
        setCalcCrabs(crabs);
    }

    const crabDisplay = (nCrabs: number, odds: number): JSX.Element => {
        return (
            <Typography variant="h5">
                {(100 * odds).toFixed(2)}% Chance for {numberToRange(nCrabs).map(() => <SymImg tile={Symbol.Crab} style={{ marginBottom: -8 }} />)} {nCrabs < 5 ? " or more" : null}
            </Typography>
        )
    }

    return (<Grid container alignItems="center" justifyContent="center">
        <Grid item xs={12}>
            <Typography variant="h3">
                <SymImg tile={Symbol.Crab} size={120} style={{ marginBottom: -30 }} />
                Crab Calculator
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="h6">
                Find coins from having crabs
            </Typography>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={2} alignItems={"end"} justifySelf={"end"}>
            <TextField
                label="Number of Crabs"
                variant="outlined"
                type="number"
                value={crabs}
                onChange={(e) => setCrabs(e.target.value as any)} />
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
            {lineOdds !== undefined && spinOdds !== undefined ? <React.Fragment>
                {numberToRange(calcCrabs).map((n) => crabDisplay(n, spinOdds.slice(n).reduce((a, b) => a + b)))}
                <Typography variant="h3">
                    {coinTotal!.toFixed(2)}<SymImg tile={Symbol.Coin} size={60} style={{ marginBottom: -12 }} /> per crab
                </Typography>
            </React.Fragment> : null}
        </Grid>
        <Grid item xs={3} />
    </Grid>)
}

export default CrabCalculator;