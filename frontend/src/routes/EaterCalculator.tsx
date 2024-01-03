import { Button, Grid, TextField, Typography } from "@mui/material";
import SymImg from "../components/SymImg";
import { Symbol } from "../common/models/symbol";
import { Item } from "../common/models/item";
import { shuffle, adjacentIdxs } from "../utils/simulate";
import { useState } from "react";
import React from "react";

interface EaterStats {
    avgSpins: number,
    avgShows: number,
    breakevenAt1: number,
    breakevenAt2: number,
    breakevenAt3: number,
}

const EaterCalculator: React.FC = () => {
    const [total, setTotal] = useState<number>(20);
    // TODO: improve this by adding option to select:
    // - calculation method (average vs middle 50th percentile vs middle 90th percentile)
    // - relevant items (protractor / telescope / protractor essence / telescope essence)

    const [stats, setStats] = useState<EaterStats | undefined>(undefined);

    const calculate = () => {

        // The probability the two symbols are adjacent GIVEN that they are both present
        const adjacentOdds = (
            (4 / 20) * (3 / 20) // Odds its in a corner * number of square adjacent to a corner
            + (8 / 20) * (5 / 20) // Odds its on an edge * number of squares adjacent to an edge
            + (8 / 20) * (8 / 20) // Odds its in the center * number of squares adjacent to that
        );

        // The probability that the two symbols are both not present
        let eTotal = Math.max(total, 20);
        const bothNotPresent = ((eTotal - 20) / eTotal) * ((eTotal - 1 - 20) / (eTotal - 1));
        const oneIsPresent = ((20) / eTotal) * ((eTotal - 1 - 19) / (eTotal - 1)) * 2;
        const bothPresent = (20 / eTotal) * (19 / (eTotal - 1));

        const pEaten = adjacentOdds * bothPresent;
        const avgSpins = 1 / pEaten;
        // When only 1 shows, exactly half the time 
        const avgShows = avgSpins * (bothPresent + oneIsPresent * .5);
        const breakevenAt1 = (avgShows / (20 / (Math.max(eTotal - 1, 20)))) + avgSpins;
        const breakevenAt2 = (2 * avgShows / (20 / (Math.max(eTotal - 1, 20)))) + avgSpins;
        const breakevenAt3 = (3 * avgShows / (20 / (Math.max(eTotal - 1, 20)))) + avgSpins;

        setStats({
            avgSpins,
            avgShows,
            breakevenAt1,
            breakevenAt2,
            breakevenAt3,
        });
    }

    return (<Grid container alignItems="center" justifyContent="center">
        <Grid item xs={12}>
            <Typography variant="h3">
                <SymImg tile={Symbol.EldritchCreature} size={120} omitTooltip style={{ marginBottom: -30 }} />
                Eater Calculator
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="h6">
                Find the cost of introducing a new symbol that can be eaten.
            </Typography>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={2}>
            <TextField
                label="Number of Symbols"
                variant="outlined"
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value as any)} />
        </Grid>
        <Grid item xs={2}>
            <Button variant="outlined" onClick={calculate}>
                Calculate
            </Button>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={3} />
        <Grid item xs={6}>
            {stats !== undefined ? <React.Fragment>
                <Typography variant="h5">
                    {stats.avgSpins.toFixed(1)} spins
                </Typography>
                <Typography variant="h5">
                    {stats.avgShows.toFixed(1)} appearances
                </Typography>
                <Typography variant="h5">
                    At -1<SymImg tile={Symbol.Coin} omitTooltip textAlign />: {stats.breakevenAt1.toFixed(1)} spins to break even
                </Typography>
                <Typography variant="h5">
                    At -2<SymImg tile={Symbol.Coin} omitTooltip textAlign />: {stats.breakevenAt2.toFixed(1)} spins to break even
                </Typography>
                <Typography variant="h5">
                    At -3<SymImg tile={Symbol.Coin} omitTooltip textAlign />: {stats.breakevenAt3.toFixed(1)} spins to break even
                </Typography>
            </React.Fragment> : null}
        </Grid>
        <Grid item xs={3} />
    </Grid>)
}

export default EaterCalculator;