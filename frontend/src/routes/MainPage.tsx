import { Box, Card, CardContent, Grid, Link, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AllSymbolStats, { SymbolStats } from "../components/AllSymbolStats";
import { useEffect, useState } from "react";
import API_ENDPOINT from "../utils/api";
import { Rarity, rarityColor } from "../common/models/rarity";
import { Symbol, SymbolUtils, isSymbol } from "../common/models/symbol";
import SymImg from "../components/SymImg";
import { ItemStats } from "../components/AllItemStats";
import { EssenceStats } from "../components/AllEssenceStats";
import { Item, isItem, itemToDisplay } from "../common/models/item";
import { RunInfo } from "../common/models/run";
import DisplayRuns from "../components/DisplayRuns";

interface WebsiteStats {
    userCount: number,
    runCount: number,
}

interface BestPlayerStats {
    id: number,
    username: string,
    win_rate: number,
    total_games: number,
}

enum Metric {
    // pickrate
    Popularity,
    // Winrate when picked
    Winrate,
}

function metricTitle(metric: Metric): string {
    switch (metric) {
        case Metric.Popularity:
            return "Popular"
        case Metric.Winrate:
            return "Best"
    }
}

function metricSubtext(metric: Metric): string {
    switch (metric) {
        case Metric.Popularity:
            return "By pick rate"
        case Metric.Winrate:
            return "By winrate when picked"
    }
}

enum TileType {
    Symbol = "Symbol",
    Item = "Item",
    Essence = "Essence",
}

interface TileStats {
    name: Symbol | Item,
    rarity: Rarity,
    win_rate: number,
    total_games: number,
    chosen_games: number,
    chosen_won_games: number,
}

const MainPage: React.FC = () => {

    const [itemStats, setItemStats] = useState<Array<ItemStats>>([]);
    const [symbolStats, setSymbolStats] = useState<Array<SymbolStats>>([]);
    const [essenceStats, setEssenceStats] = useState<Array<EssenceStats>>([]);
    const [websiteStats, setWebsiteStats] = useState<WebsiteStats | undefined>(undefined);
    const [bestPlayerStats, setBestPlayerStats] = useState<Array<BestPlayerStats> | undefined>(undefined);
    const [recentRuns, setRecentRuns] = useState<Array<RunInfo>>([]);

    useEffect(() => {
        const fetchSymbolStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/symbolStats`);
            if (!response.ok) {
                console.log(`Error fetching symbol stats`);
                return;
            }
            const jsonData = await response.json();
            setSymbolStats(jsonData);
        }

        const fetchItemStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/itemStats`);
            if (!response.ok) {
                console.log(`Error fetching item stats`);
                return;
            }
            const jsonData = await response.json();
            setItemStats(jsonData);
        }

        const fetchEssenceStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/essenceStats`);
            if (!response.ok) {
                console.log(`Error fetching item stats`);
                return;
            }
            const jsonData = await response.json();
            setEssenceStats(jsonData);
        }

        const fetchBestPlayers = async () => {
            const response = await fetch(`${API_ENDPOINT}/bestPlayers`);
            if (!response.ok) {
                console.log(`Error fetching best player stats`);
                return;
            }
            const jsonData = (await response.json());
            setBestPlayerStats(jsonData);

            console.log("set best player stats", jsonData);
        }

        const fetchWebsiteStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/mainStats`);
            if (!response.ok) {
                console.log(`Error fetching main stats`);
                return;
            }
            const jsonData = (await response.json());
            setWebsiteStats(jsonData);
        }

        const fetchRecentRuns = async () => {
            const response = await fetch(`${API_ENDPOINT}/recentRuns`);
            if (!response.ok) {
                console.log(`Error fetching recent runs`);
                return;
            }
            const jsonData = (await response.json());
            const runs = [];
            for (const jRunInfo of jsonData) {
                const runInfo = new RunInfo(
                    jRunInfo.hash,
                    jRunInfo.number,
                    jRunInfo.version,
                    jRunInfo.isFloor20,
                    jRunInfo.date,
                    jRunInfo.duration,
                    jRunInfo.victory,
                    jRunInfo.guillotine,
                    jRunInfo.spins,
                    jRunInfo.earlySyms.split(",") as Symbol[],
                    jRunInfo.midSyms.split(",") as Symbol[],
                    jRunInfo.lateSyms.split(",") as Symbol[],
                );
                runInfo.authorInfo = {
                    userId: jRunInfo.UserId,
                    username: jRunInfo.User.username,
                };
                runs.push(runInfo);
            }
            setRecentRuns(runs);
        }

        fetchSymbolStats().catch(console.error);
        fetchItemStats().catch(console.error);
        fetchEssenceStats().catch(console.error);
        fetchBestPlayers().catch(console.error);
        fetchWebsiteStats().catch(console.error);
        fetchRecentRuns().catch(console.error);
    }, []);

    return <Grid container alignItems="start" justifyContent="center" spacing="30">
        <Grid item>
            <Typography variant="h3">
                Luck be a Statlord
            </Typography>
        </Grid>
        <Box width="100%" />
        <Grid item>
            <Card>
                <CardContent>
                    <Typography variant="h3">
                        Website Stats
                    </Typography>
                    <Paper elevation={3}>
                        <Typography sx={{ fontSize: 25, marginTop: -2 }} color="text.secondary" gutterBottom lineHeight={.9}>
                            Users
                        </Typography>
                        <Typography variant="h3" lineHeight={.9} sx={{ marginTop: -3, marginBottom: -1 }}>
                            {websiteStats?.userCount ?? "..."}
                        </Typography>
                    </Paper>
                    <Paper elevation={3} sx={{ marginTop: 4 }}>
                        <Typography sx={{ fontSize: 25, marginTop: -2 }} color="text.secondary" gutterBottom lineHeight={.9}>
                            Runs
                        </Typography>
                        <Typography variant="h3" lineHeight={.9} sx={{ marginTop: -3, marginBottom: -1 }}>
                            {websiteStats?.runCount ?? "..."}
                        </Typography>
                    </Paper>
                </CardContent>
            </Card>
        </Grid>
        <Grid item>
            {bestPlayersCard(bestPlayerStats)}
        </Grid>
        <Grid item>
            {recentRunsCard(recentRuns)}
        </Grid>
        <Grid item>
            {bestTilesCard(symbolStats, Metric.Popularity, TileType.Symbol)}
        </Grid>
        <Grid item>
            {bestTilesCard(symbolStats, Metric.Winrate, TileType.Symbol)}
        </Grid>
        <Grid item>
            {bestTilesCard(itemStats, Metric.Popularity, TileType.Item)}
        </Grid>
        <Grid item>
            {bestTilesCard(itemStats, Metric.Winrate, TileType.Item)}
        </Grid>
        <Grid item>
            {bestTilesCard(essenceStats as any, Metric.Popularity, TileType.Essence)}
        </Grid>
        <Grid item>
            {bestTilesCard(essenceStats as any, Metric.Winrate, TileType.Essence)}
        </Grid>
        <Grid item xs={12}>
            <Box width="100%" height="10" />
        </Grid>
    </Grid>
}

const bestPlayersCard = (bestPlayerStats: Array<BestPlayerStats> | undefined): JSX.Element => {
    return <Card>
        <CardContent>
            <Typography variant="h5" gutterBottom lineHeight={.5}>
                Best F20 Players
            </Typography>
            <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                80 games minimum
            </Typography>
            {
                bestPlayerStats ?
                    <Table>
                        <TableHead>
                            <TableRow>

                                <TableCell>
                                    Username
                                </TableCell>
                                <TableCell>
                                    Winrate
                                </TableCell>
                                <TableCell>
                                    Games
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bestPlayerStats.map((stats) =>
                                <TableRow key={stats.username}>
                                    <TableCell>
                                        <Link href={`/profile/${stats.id}`}>
                                            {stats.username}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {stats.win_rate}%
                                    </TableCell>
                                    <TableCell>
                                        {stats.total_games}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    : null
            }
        </CardContent>
    </Card>
}

const bestTilesCard = (tileStats: Array<TileStats>, metric: Metric, type: TileType): JSX.Element => {
    return <Card>
        <CardContent>
            <Typography variant="h5" gutterBottom lineHeight={.5}>
                {`${metricTitle(metric)} ${type}s`}
            </Typography>
            <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                {metricSubtext(metric)}
            </Typography>
            {
                tileStats ?
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {type}
                                </TableCell>
                                <TableCell>
                                    Picked Winrate
                                </TableCell>
                                <TableCell>
                                    Games
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterTileStats(tileStats, metric, type).map((stats) =>
                                <TableRow key={stats.name}>
                                    <TableCell>
                                        <SymImg tile={stats.name} textAlign />
                                        <Link href={`/symbolDetails?symbol=${stats.name}`} color={rarityColor(stats.rarity)}>
                                            {isSymbol(stats.name) ? SymbolUtils.symbolToDisplay(stats.name) : null}
                                            {isItem(stats.name) ? itemToDisplay(stats.name) : null}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {type === TileType.Essence ? stats.win_rate : (100 * stats.chosen_won_games / stats.chosen_games).toFixed(2)}%
                                    </TableCell>
                                    <TableCell>
                                        {stats.total_games}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    : null
            }
        </CardContent>
    </Card>
}

const filterTileStats = (stats: Array<TileStats>, metric: Metric, type: TileType): Array<TileStats> => {
    if (stats.length === 0) {
        return [];
    }

    if (type === TileType.Essence) {
        const ret = [...stats];
        if (metric === Metric.Popularity) {
            ret.sort((a: TileStats, b: TileStats) => b.total_games - a.total_games)
        } else if (metric === Metric.Winrate) {
            ret.sort((a: TileStats, b: TileStats) => b.win_rate - a.win_rate)
        }

        return ret.slice(0, 4);
    }

    const bestByRarity = new Map<Rarity, TileStats>();

    for (const symStat of stats) {
        const bestSoFar = bestByRarity.get(symStat.rarity);
        if (bestSoFar === undefined) {
            if (symStat.rarity !== Rarity.Special) {
                bestByRarity.set(symStat.rarity, symStat);
            }
            continue;
        }

        switch (metric) {
            case Metric.Winrate:
                if (symStat.chosen_won_games / symStat.chosen_games > bestSoFar.chosen_won_games / bestSoFar.chosen_games) {
                    bestByRarity.set(symStat.rarity, symStat);
                }
                break;
            case Metric.Popularity:
                if (symStat.chosen_games > bestSoFar.chosen_games) {
                    bestByRarity.set(symStat.rarity, symStat);
                }
                break;
        }
    }

    return [bestByRarity.get(Rarity.VeryRare)!, bestByRarity.get(Rarity.Rare)!, bestByRarity.get(Rarity.Uncommon)!, bestByRarity.get(Rarity.Common)!];
}

const recentRunsCard = (runs: Array<RunInfo>): JSX.Element => {
    return <Card>
        <CardContent>
            <Typography variant="h5" gutterBottom lineHeight={.5}>
                Recently Uploaded Runs
            </Typography>
            {<DisplayRuns runs={runs} omitDuration />}
        </CardContent>
    </Card>
}

export default MainPage;