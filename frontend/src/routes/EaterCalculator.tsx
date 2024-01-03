import { Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
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

type AdjacencyItem = Item.Protractor | Item.ProtractorEssence | Item.Telescope | Item.TelescopeEssence | Item.SwappingDevice;

const EaterCalculator: React.FC = () => {
    const [total, setTotal] = useState<number>(20);
    // TODO: improve this by adding option to select:
    // - calculation method (average vs middle 50th percentile vs middle 90th percentile)
    // - relevant items (protractor / telescope / protractor essence / telescope essence)

    const [stats, setStats] = useState<EaterStats | undefined>(undefined);
    const [item, setItem] = useState<AdjacencyItem | Item.ItemMissing>(Item.ItemMissing);

    const calculate = () => {

        // The base probability the two symbols are adjacent GIVEN that they are both present
        let cornerOdds = (4 / 20) * (3 / 20);
        if (item === Item.Protractor) {
            cornerOdds = (3 / 20) * (2 / 3) + (1 / 3);
        } else if (item === Item.ProtractorEssence) {
            cornerOdds = 1;
        }
        let adjacentOdds = (
            (4 / 20) * cornerOdds // Odds its in a corner * number of square adjacent to a corner
            + (8 / 20) * (5 / 20) // Odds its on an edge * number of squares adjacent to an edge
            + (8 / 20) * (8 / 20) // Odds its in the center * number of squares adjacent to that
        );

        if (item === Item.TelescopeEssence) {
            adjacentOdds = 1;
        } else if (item === Item.Telescope) {
            adjacentOdds = (2 / 3) * adjacentOdds + (1 / 3);
        }

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
            <FormControl sx={{ minWidth: 280 }}>
                <InputLabel>Item</InputLabel>
                <Select
                    value={item}
                    label="Item"
                    variant="outlined"
                    autoWidth
                    onChange={(e) => setItem(e.target.value as AdjacencyItem | Item.ItemMissing)}
                >
                    <MenuItem value={Item.ItemMissing}>None</MenuItem>
                    <MenuItem value={Item.Protractor}><SymImg tile={Item.Protractor} textAlign />Protractor</MenuItem>
                    <MenuItem value={Item.ProtractorEssence}><SymImg tile={Item.ProtractorEssence} textAlign />Protractor Essence</MenuItem>
                    <MenuItem value={Item.Telescope}><SymImg tile={Item.Telescope} textAlign />Telescope</MenuItem>
                    <MenuItem value={Item.TelescopeEssence}><SymImg tile={Item.TelescopeEssence} textAlign />Telescope Essence</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={2}>
            <Button variant="outlined" onClick={calculate}>
                Calculate
            </Button>
        </Grid>
        <Grid item xs={2} />
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