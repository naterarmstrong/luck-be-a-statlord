import { Autocomplete, Box, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, List, ListItem, OutlinedInput, TextField, Typography } from "@mui/material";
import { SYMBOL_RARITIES, Symbol, isSymbol } from "../common/models/symbol";
import { rarityColor } from "../common/models/rarity";
import { useEffect, useState } from "react";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { useSearchParams } from "react-router-dom";
import SymbolSelector from "../components/SymbolSelector";
import SymImg from "../components/SymImg";
import { SymbolStats } from "../components/SymbolStatDisplay";
import { ordinal } from "../utils/ordinal";
import ItemSelector from "../components/ItemSelector";
import { Item } from "../common/models/item";
import { sfmt } from "../utils/strfmt";
import API_ENDPOINT from "../utils/api";

export interface PairPerformance {
    WinRateTogether: number,
    WinRateSymbol1: number,
    WinRateSymbol2: number,
    GamesTogether: number,
    GamesApartSymbol1: number,
    GamesApartSymbol2: number,
    TotalTotalGames: number,
}

export interface Ratings {
    Winrate: number,
    WinrateRanking: number,
    SameRarityWinrateRanking: number,
    Games: number,
    GamesRanking: number,
    SameRarityGamesRanking: number,
}

const SymbolDetails: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    let startSymbol = Symbol.Unknown;
    let secondaryStartSymbol = Symbol.Unknown;
    if (searchParams.get("symbol") !== null && isSymbol(searchParams.get("symbol") as any)) {
        startSymbol = searchParams.get("symbol") as Symbol;
    }
    if (searchParams.get("secondarySymbol") !== null && isSymbol(searchParams.get("secondarySymbol") as any)) {
        secondaryStartSymbol = searchParams.get("secondarySymbol") as Symbol;
    }
    const [symbol, setSymbol] = useState<Symbol>(startSymbol);
    const [secondarySymbol, setSecondarySymbol] = useState<Symbol>(secondaryStartSymbol);
    const [secondaryItem, setSecondaryItem] = useState<Item>(Item.ItemMissing);
    const [pairPerf, setPairPerf] = useState<PairPerformance | null>(null);
    const [fullStats, setFullStats] = useState<Array<SymbolStats>>([]);
    const [ratings, setRatings] = useState<Ratings | null>(null);

    useEffect(() => {
        const fetchFullSymbolStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/symbolStats`);
            if (!response.ok) {
                console.log(`Error fetching symbol stats`);
            }
            const jsonData = (await response.json());
            setFullStats(jsonData);
        }

        fetchFullSymbolStats().catch(console.error);
    }, [])

    useEffect(() => {
        setSearchParams({ symbol: symbol, secondarySymbol: secondarySymbol });
    }, [symbol, secondarySymbol])


    useEffect(() => {
        if (symbol === Symbol.Unknown || secondarySymbol === Symbol.Unknown) {
            return
        }

        const fetchSymbolStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/symbol/${symbol}/with/${secondarySymbol}`);
            if (!response.ok) {
                console.log(`Error fetching symbol stats`);
            }
            const jsonData = await response.json();
            setPairPerf(jsonData);
        }

        fetchSymbolStats().catch(console.error);
    }, [symbol, secondarySymbol])

    useEffect(() => {
        if (symbol == Symbol.Unknown || fullStats.length == 0) {
            setRatings(null);
            return
        }

        const myStats = fullStats.find((v) => v.name == symbol);
        if (!myStats) {
            console.error(`Didn't find my stats in full stat array: ${symbol}`);
            setRatings(null);
            return
        }
        let wrRank = 1;
        let relativeWrRank = 1;
        let gRank = 1;
        let relativeGRank = 1;
        for (const stats of fullStats) {
            if (stats.name == symbol) {
                continue;
            }
            if (stats.win_rate > myStats.win_rate) {
                if (stats.rarity == myStats.rarity) {
                    relativeWrRank += 1;
                }
                wrRank += 1;
            }
            if (stats.total_games > myStats.total_games) {
                if (stats.rarity == myStats.rarity) {
                    relativeGRank += 1;
                }
                gRank += 1;
            }
        }

        setRatings({
            Games: myStats.total_games,
            GamesRanking: gRank,
            SameRarityGamesRanking: relativeGRank,
            Winrate: myStats.win_rate,
            WinrateRanking: wrRank,
            SameRarityWinrateRanking: relativeWrRank,
        });
    }, [symbol, fullStats])

    return <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={4}>
            <Typography variant="h4">
                Symbol Details
            </Typography>
        </Grid>
        <Grid item xs={8}>
            <SymbolSelector symbol={symbol} setSymbol={setSymbol} />
        </Grid>
        <Grid item xs={4} alignSelf="start">
            <Typography variant="h3" color={rarityColor(SYMBOL_RARITIES[symbol])}>
                <Box component="img" style={{ width: "80px", marginRight: 20 }} src={SYMBOL_TO_IMG.get(symbol)} />
                {sfmt(symbol)}
            </Typography>
            {fullStats.length > 0 && ratings ?
                <Card sx={{ mb: 1, ml: 3, mr: 3 }}>
                    <CardContent sx={{ mb: -2 }}>
                        <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                            Winrate
                        </Typography>
                        <Typography variant="h3" lineHeight={.5}>
                            {ratings.Winrate}%
                        </Typography>
                        <Box justifyContent={"center"}>
                            <Typography sx={{ display: "inline-block", mx: "50px" }}>
                                {ordinal(ratings.WinrateRanking)} overall &nbsp; &nbsp;
                                {ordinal(ratings.SameRarityWinrateRanking)}
                                <Typography color={rarityColor(SYMBOL_RARITIES[symbol])} sx={{ display: 'inline-block', mx: '8px' }}> {SYMBOL_RARITIES[symbol]} </Typography>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
                : null
            }
            {fullStats.length > 0 && ratings ?
                <Card sx={{ mb: 1, ml: 3, mr: 3 }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                            Games
                        </Typography>
                        <Typography variant="h3" lineHeight={.5}>
                            {ratings.Games}
                        </Typography>
                        <Typography sx={{ display: "inline-block", mx: "50px" }}>
                            {ordinal(ratings.GamesRanking)} overall &nbsp; &nbsp;
                            {ordinal(ratings.SameRarityGamesRanking)}
                            <Typography color={rarityColor(SYMBOL_RARITIES[symbol])} sx={{ display: 'inline-block', mx: '8px' }}> {SYMBOL_RARITIES[symbol]} </Typography>
                        </Typography>
                    </CardContent>
                </Card>
                : null}
        </Grid>
        <Grid item xs={8} alignSelf="start">
            <Grid container>
                <Grid item xs={4}>
                    <Typography variant="h6">
                        With other symbols:
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <SymbolSelector symbol={secondarySymbol} setSymbol={setSecondarySymbol} />
                </Grid>
                {pairPerf !== null ?
                    <Grid item xs={12}>
                        <SymImg tile={symbol} /> <SymImg tile={secondarySymbol} />: {pairPerf.WinRateTogether}% win rate. {(100 * pairPerf.GamesTogether / pairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                        <SymImg tile={symbol} /> <SymImg tile={Symbol.Dud} />: {pairPerf.WinRateSymbol1}% win rate. {(100 * pairPerf.GamesApartSymbol1 / pairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                        <SymImg tile={Symbol.Dud} /> <SymImg tile={secondarySymbol} />: {pairPerf.WinRateSymbol2}% win rate. {(100 * pairPerf.GamesApartSymbol2 / pairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                    </Grid> : null}
            </Grid>
        </Grid>
    </Grid>;
}

export default SymbolDetails;