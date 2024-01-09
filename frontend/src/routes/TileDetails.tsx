import { Box, Card, CardContent, Grid, Tooltip, Typography } from "@mui/material";
import { SYMBOL_RARITIES, Symbol, isSymbol } from "../common/models/symbol";
import { Rarity, rarityColor } from "../common/models/rarity";
import React, { useEffect, useState } from "react";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { useSearchParams } from "react-router-dom";
import SymbolSelector from "../components/SymbolSelector";
import SymImg from "../components/SymImg";
import { SymbolStats } from "../components/AllSymbolStats";
import { ordinal } from "../utils/ordinal";
import { sfmt } from "../utils/strfmt";
import API_ENDPOINT from "../utils/api";
import { getRarity, getTileTooltipContents, symbolHighColor } from "../components/TileTooltip";
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
    PickedWinrate: number,
    PickedWinrateRanking: number,
    SameRarityPickedWinrateRanking: number,
    Winrate: number,
    WinrateRanking: number,
    SameRarityWinrateRanking: number,
    Games: number,
    GamesRanking: number,
    SameRarityGamesRanking: number,
    PickedGames: number,
    PickedGamesRanking: number,
    SameRarityPickedGamesRanking: number,
    SameRarityCount: number,
}

type FullTileStats = TileStats | EssenceTileStats;

export interface TileStats {
    name: Symbol | Item,
    rarity: Rarity.Common | Rarity.Uncommon | Rarity.Rare | Rarity.VeryRare | Rarity.Special,
    win_rate: number,
    chosen_won_games: number,
    chosen_games: number,
    total_shows: number,
    total_games: number,
}

export interface EssenceTileStats {
    name: Item,
    rarity: Rarity.Essence,
    win_rate: number,
    chosen_won_games: number,
    chosen_games: number,
    total_shows: number,
    total_games: number,
    total_destroyed_games: number,
    destroyed_won_games: number,
}

export interface TileDetailsProps {
    mode: 'symbol' | 'item' | 'essence'
}

const TileDetails: React.FC<TileDetailsProps> = ({ mode }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    let startTile: Symbol | Item = Symbol.Unknown;
    let secondaryStartSymbol = Symbol.Unknown;
    let secondaryStartItem = Item.ItemMissing;
    if (mode === 'symbol' && searchParams.get("symbol") !== null && isSymbol(searchParams.get("symbol") as any)) {
        startTile = searchParams.get("symbol") as Symbol;
    }
    if (mode === 'item' && searchParams.get("item") !== null && isItem(searchParams.get("item") as any)) {
        startTile = searchParams.get("item") as Item;
    }
    if (mode === 'essence' && searchParams.get("essence") !== null && isItem(searchParams.get("essence") as any)) {
        startTile = searchParams.get("essence") as Item;
    }
    if (searchParams.get("secondarySymbol") !== null && isItem(searchParams.get("secondarySymbol") as any)) {
        secondaryStartItem = searchParams.get("secondaryItem") as Item;
    }

    const [tile, setTile] = useState<Symbol | Item>(startTile);
    const [secondarySymbol, setSecondarySymbol] = useState<Symbol>(secondaryStartSymbol);
    const [secondaryItem, setSecondaryItem] = useState<Item>(secondaryStartItem);
    const [symbolPairPerf, setSymbolPairPerf] = useState<PairPerformance | null>(null);
    const [itemPairPerf, setItemPairPerf] = useState<PairPerformance | null>(null);
    const [fullStats, setFullStats] = useState<Array<FullTileStats>>([]);
    const [ratings, setRatings] = useState<Ratings | null>(null);

    useEffect(() => {
        const fetchFullStatsOfType = async () => {
            let path = "symbolStats";
            if (mode === 'item') {
                path = "itemStats"
            } else if (mode === 'essence') {
                path = "essenceStats"
            }
            const response = await fetch(`${API_ENDPOINT}/${path}`);
            if (!response.ok) {
                console.log(`Error fetching stats`);
            }
            const jsonData = (await response.json());
            setFullStats(jsonData);
        }

        fetchFullStatsOfType().catch(console.error);
    }, [mode])

    useEffect(() => {
        if (mode === 'symbol') {
            setSearchParams({ symbol: tile, secondarySymbol: secondarySymbol, secondaryItem: secondaryItem });
        } else if (mode === 'item') {
            setSearchParams({ item: tile, secondarySymbol: secondarySymbol, secondaryItem: secondaryItem });
        } else if (mode === 'essence') {
            setSearchParams({ essence: tile, secondarySymbol: secondarySymbol, secondaryItem: secondaryItem });
        }
    }, [tile, secondarySymbol, secondaryItem, setSearchParams])


    useEffect(() => {
        if (isEmpty(tile) || secondarySymbol === Symbol.Unknown) {
            return
        }

        const fetchPairStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/tilePairs/${tile}/with/${secondarySymbol}`);
            if (!response.ok) {
                console.log(`Error fetching symbol stats`);
            }
            const jsonData = await response.json();
            setSymbolPairPerf(jsonData);
        }

        fetchPairStats().catch(console.error);
    }, [tile, secondarySymbol])

    useEffect(() => {
        if (isEmpty(tile) || secondaryItem === Item.ItemMissing) {
            return
        }

        const fetchSymbolStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/tilePairs/${tile}/with/${secondaryItem}`);
            if (!response.ok) {
                console.log(`Error fetching item pair stats`);
            }
            const jsonData = await response.json();
            setItemPairPerf(jsonData);
        }

        fetchSymbolStats().catch(console.error);
    }, [tile, secondaryItem])

    useEffect(() => {
        if (isEmpty(tile) || fullStats.length === 0) {
            setRatings(null);
            return
        }

        const myStats = fullStats.find((v) => v.name === tile);
        if (!myStats) {
            console.error(`Didn't find my stats in full stat array: ${tile}`);
            setRatings(null);
            return
        }
        let wrRank = 1;
        let relativeWrRank = 1;
        let gRank = 1;
        let relativeGRank = 1;
        let pRank = 1;
        let relativePRank = 1;
        let pWrRank = 1;
        let relativePWrRank = 1;
        let sameRarityCount = 1;

        for (const stats of fullStats) {
            if (stats.name === tile) {
                continue;
            }
            if (stats.win_rate > myStats.win_rate) {
                if (stats.rarity === myStats.rarity) {
                    relativeWrRank += 1;
                }
                wrRank += 1;
            }
            if (stats.chosen_won_games / stats.chosen_games > myStats.chosen_won_games / myStats.chosen_games) {
                if (stats.rarity === myStats.rarity) {
                    relativePWrRank += 1;
                }
                pWrRank += 1;
            }
            if (stats.total_games > myStats.total_games) {
                if (stats.rarity === myStats.rarity) {
                    relativeGRank += 1;
                }
                gRank += 1;
            }
            if (stats.chosen_games > myStats.chosen_games) {
                if (stats.rarity === myStats.rarity) {
                    relativePRank += 1;
                }
                pRank += 1;
            }
            if (stats.rarity === myStats.rarity) {
                sameRarityCount += 1;
            }
        }

        const roundedPickedWinrate = Math.round(10000 * myStats.chosen_won_games / myStats.chosen_games) / 100;

        setRatings({
            PickedGames: myStats.chosen_games,
            PickedGamesRanking: pRank,
            SameRarityPickedGamesRanking: relativePRank,
            Games: myStats.total_games,
            GamesRanking: gRank,
            SameRarityGamesRanking: relativeGRank,
            Winrate: myStats.win_rate,
            WinrateRanking: wrRank,
            SameRarityWinrateRanking: relativeWrRank,
            PickedWinrate: roundedPickedWinrate,
            PickedWinrateRanking: pWrRank,
            SameRarityPickedWinrateRanking: relativePWrRank,
            SameRarityCount: sameRarityCount
        });
    }, [tile, fullStats])

    return <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={4}>
            <Typography variant="h4">
                {mode.at(0)!.toUpperCase() + mode.slice(1)} Details
            </Typography>
        </Grid>
        <Grid item xs={8}>
            {mode === 'symbol' && <SymbolSelector symbol={tile as Symbol} setSymbol={setTile} />}
            {mode === 'item' && <ItemSelector item={tile as Item} setItem={setTile} />}
            {mode === 'essence' && <ItemSelector item={tile as Item} setItem={setTile} essence />}
        </Grid>
        <Grid item xs={4} alignSelf="start">
            <Typography variant="h3" color={rarityColor(getRarity(tile))}>
                <SymImg size={80} tile={tile} />
                {sfmt(tile)}
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
                    {getTileTooltipContents(tile)}
                </CardContent>
            </Card>
            {fullStats.length > 0 && ratings && pickedAndTotalSufficientlyDifferent(ratings.PickedGames, ratings.Games) ?
                <Card sx={{ mb: 1, ml: 3, mr: 3 }}>
                    <CardContent sx={{ mb: -2 }}>
                        <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                            Picked Winrate
                        </Typography>
                        <Typography variant="h3" lineHeight={.5}>
                            {ratings.PickedWinrate}%
                        </Typography>
                        <Box justifyContent={"center"}>
                            <Typography sx={{ display: "inline-block", mx: "50px" }}>
                                {ordinal(ratings.PickedWinrateRanking)} overall &nbsp; &nbsp;
                                {ordinal(ratings.SameRarityPickedWinrateRanking)}
                                <Typography color={rarityColor(getRarity(tile))} sx={{ display: 'inline-block', mx: '8px' }}> {getRarity(tile)} </Typography>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
                : null
            }
            {fullStats.length > 0 && ratings && pickedAndTotalSufficientlyDifferent(ratings.PickedGames, ratings.Games) ?
                <Card sx={{ mb: 1, ml: 3, mr: 3 }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                            Picked Games
                        </Typography>
                        <Tooltip title="try2">
                            <Typography variant="h3" lineHeight={.5}>
                                {ratings.PickedGames}
                            </Typography>
                        </Tooltip>
                        <Typography sx={{ display: "inline-block", mx: "50px" }}>
                            {ordinal(ratings.PickedGamesRanking)} overall &nbsp; &nbsp;
                            {ordinal(ratings.SameRarityPickedGamesRanking)}
                            <Typography color={rarityColor(getRarity(tile))} sx={{ display: 'inline-block', mx: '8px' }}> {getRarity(tile)} </Typography>
                        </Typography>
                    </CardContent>
                </Card>
                : null}
            {fullStats.length > 0 && ratings ?
                <React.Fragment>
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
                                    <Typography color={rarityColor(getRarity(tile))} sx={{ display: 'inline-block', mx: '8px' }}> {getRarity(tile)} </Typography>
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card sx={{ mb: 1, ml: 3, mr: 3 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                                Games
                            </Typography>
                            <Tooltip title="try2">
                                <Typography variant="h3" lineHeight={.5}>
                                    {ratings.Games}
                                </Typography>
                            </Tooltip>
                            <Typography sx={{ display: "inline-block", mx: "50px" }}>
                                {ordinal(ratings.GamesRanking)} overall &nbsp; &nbsp;
                                {ordinal(ratings.SameRarityGamesRanking)}
                                <Typography color={rarityColor(getRarity(tile))} sx={{ display: 'inline-block', mx: '8px' }}> {getRarity(tile)} </Typography>
                            </Typography>
                        </CardContent>
                    </Card>
                </React.Fragment>
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
                <Grid item xs={4} />
                <Grid item xs={8}>
                    {symbolPairPerf !== null ?
                        <Grid container>
                            <Grid item>
                                <SymImg tile={tile} /> <SymImg tile={secondarySymbol} />: {symbolPairPerf.WinrateTogether}% win rate. {(100 * symbolPairPerf.GamesTogether / symbolPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                            </Grid>
                            <Grid item>
                                <SymImg tile={tile} /> <SymImg tile={Symbol.Dud} />: {symbolPairPerf.WinrateTile1}% win rate. {(100 * symbolPairPerf.GamesApartTile1 / symbolPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                            </Grid>
                            <Grid item>
                                <SymImg tile={Symbol.Dud} /> <SymImg tile={secondarySymbol} />: {symbolPairPerf.WinrateTile2}% win rate. {(100 * symbolPairPerf.GamesApartTile2 / symbolPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                            </Grid>
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
                <Grid item xs={4} />
                <Grid item xs={8}>
                    {itemPairPerf !== null ?
                        <Grid container>
                            <Grid item>
                                <SymImg tile={tile} /> <SymImg tile={secondaryItem} />: {itemPairPerf.WinrateTogether}% win rate. {(100 * itemPairPerf.GamesTogether / itemPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                            </Grid>
                            <Grid item>
                                <SymImg tile={tile} /> <SymImg tile={Symbol.Dud} />: {itemPairPerf.WinrateTile1}% win rate. {(100 * itemPairPerf.GamesApartTile1 / itemPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                            </Grid>
                            <Grid item>
                                <SymImg tile={Symbol.Dud} /> <SymImg tile={secondaryItem} />: {itemPairPerf.WinrateTile2}% win rate. {(100 * itemPairPerf.GamesApartTile2 / itemPairPerf.TotalTotalGames).toFixed(1)}% of games. <br />
                            </Grid>
                        </Grid> : null}
                </Grid>
            </Grid>
        </Grid>
    </Grid>;
}

function isEmpty(t: Symbol | Item) {
    return t === Symbol.Unknown || t === Item.ItemMissing
}

function pickedAndTotalSufficientlyDifferent(picked: number, total: number): boolean {
    return ((Math.abs(picked - total) / picked) > 0.05);
}

export default TileDetails;