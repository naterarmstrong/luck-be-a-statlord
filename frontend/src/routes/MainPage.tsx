import { Box, Card, CardContent, Grid, Link, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AllSymbolStats, { SymbolStats } from "../components/AllSymbolStats";
import { useEffect, useState } from "react";
import API_ENDPOINT from "../utils/api";
import { Rarity, rarityColor } from "../common/models/rarity";
import { Symbol, SymbolUtils } from "../common/models/symbol";
import SymImg from "../components/SymImg";
import { ItemStats } from "../components/AllItemStats";
import { EssenceStats } from "../components/AllEssenceStats";
import { itemToDisplay } from "../common/models/item";

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

const MainPage: React.FC = () => {

    const [itemStats, setItemStats] = useState<Array<ItemStats>>([]);
    const [symbolStats, setSymbolStats] = useState<Array<SymbolStats>>([]);
    const [essenceStats, setEssenceStats] = useState<Array<EssenceStats>>([]);
    const [websiteStats, setWebsiteStats] = useState<WebsiteStats | undefined>(undefined);
    const [bestPlayerStats, setBestPlayerStats] = useState<Array<BestPlayerStats> | undefined>(undefined);

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

        fetchSymbolStats().catch(console.error);
        fetchItemStats().catch(console.error);
        fetchEssenceStats().catch(console.error);
        fetchBestPlayers().catch(console.error);
        fetchWebsiteStats().catch(console.error);
    }, []);

    return <Grid container alignItems="center" justifyContent="center" spacing="50">
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
            {bestSymbolsCard(symbolStats)}
        </Grid>
        <Grid item>
            {bestItemsCard(itemStats)}
        </Grid>
        <Grid item>
            {popularEssencesCard(essenceStats)}
        </Grid>
        <Grid item>
            {strongEssencesCard(essenceStats)}
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
                                    Total Games
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

const bestSymbolsCard = (symbolStats: Array<SymbolStats>): JSX.Element => {
    return <Card>
        <CardContent>
            <Typography variant="h5" gutterBottom lineHeight={.5}>
                Best Symbols
            </Typography>
            <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                By winrate when picked
            </Typography>
            {
                symbolStats ?
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Symbol
                                </TableCell>
                                <TableCell>
                                    Winrate
                                </TableCell>
                                <TableCell>
                                    Total Games
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterSymbolStats(symbolStats).map((stats) =>
                                <TableRow key={stats.name}>
                                    <TableCell>
                                        <SymImg tile={stats.name} textAlign />
                                        <Link href={`/symbolDetails/${stats.name}`} color={rarityColor(stats.rarity)}>
                                            {SymbolUtils.symbolToDisplay(stats.name)}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {(100 * stats.chosen_won_games / stats.chosen_games).toFixed(2)}%
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

const filterSymbolStats = (stats: Array<SymbolStats>): Array<SymbolStats> => {
    if (stats.length === 0) {
        return [];
    }

    const bestByRarity = new Map<Rarity, SymbolStats>();

    for (const symStat of stats) {
        const bestSoFar = bestByRarity.get(symStat.rarity);
        if (bestSoFar === undefined) {
            if (symStat.rarity !== Rarity.Special) {
                bestByRarity.set(symStat.rarity, symStat);
            }
            continue;
        }

        if (symStat.chosen_won_games / symStat.chosen_games > bestSoFar.chosen_won_games / bestSoFar.chosen_games) {
            bestByRarity.set(symStat.rarity, symStat);
        }
    }

    return [bestByRarity.get(Rarity.VeryRare)!, bestByRarity.get(Rarity.Rare)!, bestByRarity.get(Rarity.Uncommon)!, bestByRarity.get(Rarity.Common)!];
}

const bestItemsCard = (itemStats: Array<ItemStats>): JSX.Element => {
    return <Card>
        <CardContent>
            <Typography variant="h5" gutterBottom lineHeight={.5}>
                Best Items
            </Typography>
            <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                By winrate when picked
            </Typography>
            {
                itemStats ?
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Symbol
                                </TableCell>
                                <TableCell>
                                    Winrate
                                </TableCell>
                                <TableCell>
                                    Total Games
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterItemStats(itemStats).map((stats) =>
                                <TableRow key={stats.name}>
                                    <TableCell>
                                        <SymImg tile={stats.name} textAlign />
                                        <Link href={`/itemDetails/${stats.name}`} color={rarityColor(stats.rarity)}>
                                            {itemToDisplay(stats.name)}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {(100 * stats.chosen_won_games / stats.chosen_games).toFixed(2)}%
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

const filterItemStats = (stats: Array<ItemStats>): Array<ItemStats> => {
    if (stats.length === 0) {
        return [];
    }

    const bestByRarity = new Map<Rarity, ItemStats>();

    for (const itemStat of stats) {
        const bestSoFar = bestByRarity.get(itemStat.rarity);
        if (bestSoFar === undefined) {
            if (itemStat.rarity !== Rarity.Special) {
                bestByRarity.set(itemStat.rarity, itemStat);
            }
            continue;
        }

        if (itemStat.chosen_won_games / itemStat.chosen_games > bestSoFar.chosen_won_games / bestSoFar.chosen_games) {
            bestByRarity.set(itemStat.rarity, itemStat);
        }
    }

    return [bestByRarity.get(Rarity.VeryRare)!, bestByRarity.get(Rarity.Rare)!, bestByRarity.get(Rarity.Uncommon)!, bestByRarity.get(Rarity.Common)!];
}

const popularEssencesCard = (essenceStats: Array<EssenceStats>): JSX.Element => {
    return <Card>
        <CardContent>
            <Typography variant="h5" gutterBottom lineHeight={.5}>
                Popular Essences
            </Typography>
            <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                By pick rate
            </Typography>
            {
                essenceStats ?
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Essence
                                </TableCell>
                                <TableCell>
                                    Winrate
                                </TableCell>
                                <TableCell>
                                    Total Games
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterPopularEssences(essenceStats).map((stats) =>
                                <TableRow key={stats.name}>
                                    <TableCell>
                                        <SymImg tile={stats.name} textAlign />
                                        <Link href={`/itemDetails/${stats.name}`} color={rarityColor(Rarity.Essence)}>
                                            {itemToDisplay(stats.name)}
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

const filterPopularEssences = (stats: Array<EssenceStats>): Array<EssenceStats> => {
    if (stats.length === 0) {
        return [];
    }

    const ret = [...stats];
    ret.sort((a: EssenceStats, b: EssenceStats) => b.total_games - a.total_games)

    return ret.slice(0, 4);
}

const strongEssencesCard = (essenceStats: Array<EssenceStats>): JSX.Element => {
    return <Card>
        <CardContent>
            <Typography variant="h5" gutterBottom lineHeight={.5}>
                Best Essences
            </Typography>
            <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                By win rate
            </Typography>
            {
                essenceStats ?
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Essence
                                </TableCell>
                                <TableCell>
                                    Winrate
                                </TableCell>
                                <TableCell>
                                    Total Games
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterStrongEssences(essenceStats).map((stats) =>
                                <TableRow key={stats.name}>
                                    <TableCell>
                                        <SymImg tile={stats.name} textAlign />
                                        <Link href={`/itemDetails/${stats.name}`} color={rarityColor(Rarity.Essence)}>
                                            {itemToDisplay(stats.name)}
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

const filterStrongEssences = (stats: Array<EssenceStats>): Array<EssenceStats> => {
    if (stats.length === 0) {
        return [];
    }

    const ret = [...stats];
    ret.sort((a: EssenceStats, b: EssenceStats) => b.win_rate - a.win_rate)

    return ret.slice(0, 4);
}

export default MainPage;