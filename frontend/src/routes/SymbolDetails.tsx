import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { SYMBOL_RARITIES, Symbol, isSymbol } from "../common/models/symbol";
import { rarityColor } from "../common/models/rarity";
import { useEffect, useState } from "react";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { useSearchParams } from "react-router-dom";
import SymbolSelector from "../components/SymbolSelector";
import SymImg from "../components/SymImg";
import { SymbolStats } from "../components/AllSymbolStats";
import { ordinal } from "../utils/ordinal";
import { sfmt } from "../utils/strfmt";
import API_ENDPOINT from "../utils/api";
import { getTileTooltipContents, symbolHighColor } from "../components/TileTooltip";
import ItemSelector from "../components/ItemSelector";
import { Item, isItem } from "../common/models/item";

export interface PairPerformance {
    WinrateTogether: number,
    WinrateTile1: number,
    WinrateTile2: number,
    GamesTogether: number,
    GamesApartTile1: number,
    GamesApartTile2: number,
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
    let secondaryStartItem = Item.ItemMissing;
    if (searchParams.get("symbol") !== null && isSymbol(searchParams.get("symbol") as any)) {
        startSymbol = searchParams.get("symbol") as Symbol;
    }
    if (searchParams.get("secondarySymbol") !== null && isItem(searchParams.get("secondarySymbol") as any)) {
        secondaryStartItem = searchParams.get("secondaryItem") as Item;
    }
    const [symbol, setSymbol] = useState<Symbol>(startSymbol);
    const [secondarySymbol, setSecondarySymbol] = useState<Symbol>(secondaryStartSymbol);
    const [secondaryItem, setSecondaryItem] = useState<Item>(secondaryStartItem);
    const [symbolPairPerf, setSymbolPairPerf] = useState<PairPerformance | null>(null);
    const [itemPairPerf, setItemPairPerf] = useState<PairPerformance | null>(null);
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
        setSearchParams({ symbol: symbol, secondarySymbol: secondarySymbol, secondaryItem: secondaryItem });
    }, [symbol, secondarySymbol, secondaryItem, setSearchParams])


    useEffect(() => {
        if (symbol === Symbol.Unknown || secondarySymbol === Symbol.Unknown) {
            return
        }

        const fetchSymbolStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/tilePairs/${symbol}/with/${secondarySymbol}`);
            if (!response.ok) {
                console.log(`Error fetching symbol stats`);
            }
            const jsonData = await response.json();
            setSymbolPairPerf(jsonData);
        }

        fetchSymbolStats().catch(console.error);
    }, [symbol, secondarySymbol])

    useEffect(() => {
        if (symbol === Symbol.Unknown || secondaryItem === Item.ItemMissing) {
            return
        }

        const fetchSymbolStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/tilePairs/${symbol}/with/${secondaryItem}`);
            if (!response.ok) {
                console.log(`Error fetching item pair stats`);
            }
            const jsonData = await response.json();
            setItemPairPerf(jsonData);
        }

        fetchSymbolStats().catch(console.error);
    }, [symbol, secondaryItem])

    useEffect(() => {
        if (symbol === Symbol.Unknown || fullStats.length === 0) {
            setRatings(null);
            return
        }

        const myStats = fullStats.find((v) => v.name === symbol);
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
            if (stats.name === symbol) {
                continue;
            }
            if (stats.win_rate > myStats.win_rate) {
                if (stats.rarity === myStats.rarity) {
                    relativeWrRank += 1;
                }
                wrRank += 1;
            }
            if (stats.total_games > myStats.total_games) {
                if (stats.rarity === myStats.rarity) {
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
            <Card sx={{ mb: 1, ml: 3, mr: 3 }} style={{
                backgroundColor: symbolHighColor,
                color: 'white',
                fontSize: "40px",
                lineHeight: .7,
                border: '6px solid black',
                borderRadius: 0,
            }}>
                <CardContent>
                    {getTileTooltipContents(symbol)}
                </CardContent>
            </Card>
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
                        With symbols:
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <SymbolSelector symbol={secondarySymbol} setSymbol={setSecondarySymbol} />
                </Grid>
                <Grid item xs={12}>
                    {symbolPairPerf !== null ?
                        <Grid item xs={12}>
                            <SymImg tile={symbol} /> <SymImg tile={secondarySymbol} />: {symbolPairPerf.WinrateTogether}% win rate. {(100 * symbolPairPerf.GamesTogether / symbolPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                            <SymImg tile={symbol} /> <SymImg tile={Symbol.Dud} />: {symbolPairPerf.WinrateTile1}% win rate. {(100 * symbolPairPerf.GamesApartTile1 / symbolPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                            <SymImg tile={Symbol.Dud} /> <SymImg tile={secondarySymbol} />: {symbolPairPerf.WinrateTile2}% win rate. {(100 * symbolPairPerf.GamesApartTile2 / symbolPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                        </Grid> : null}
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h6">
                        With items:
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <ItemSelector item={secondaryItem} setItem={setSecondaryItem} />
                </Grid>
                <Grid item xs={12}>
                    {itemPairPerf !== null ?
                        <Grid item xs={12}>
                            <SymImg tile={symbol} /> <SymImg tile={secondaryItem} />: {itemPairPerf.WinrateTogether}% win rate. {(100 * itemPairPerf.GamesTogether / itemPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                            <SymImg tile={symbol} /> <SymImg tile={Symbol.Dud} />: {itemPairPerf.WinrateTile1}% win rate. {(100 * itemPairPerf.GamesApartTile1 / itemPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                            <SymImg tile={Symbol.Dud} /> <SymImg tile={secondaryItem} />: {itemPairPerf.WinrateTile2}% win rate. {(100 * itemPairPerf.GamesApartTile2 / itemPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                        </Grid> : null}
                </Grid>
            </Grid>
        </Grid>
    </Grid>;
}

export default SymbolDetails;