import { Box, Card, CardContent, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_ENDPOINT from "../utils/api";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { Symbol } from "../common/models/symbol";
import { ordinal } from "../utils/ordinal";
import { LineChart } from "@mui/x-charts";
import { RunInfo } from "../common/models/run";
import DisplayRuns from "../components/DisplayRuns";

type ProfileStats = {
    total_games: number,
    wins: number,
    guillotines: number,
    beat_rent_1_count: number,
    beat_rent_2_count: number,
    beat_rent_3_count: number,
    beat_rent_4_count: number,
    beat_rent_5_count: number,
    beat_rent_6_count: number,
    beat_rent_7_count: number,
    beat_rent_8_count: number,
    beat_rent_9_count: number,
    beat_rent_10_count: number,
    beat_rent_11_count: number,
    beat_rent_12_count: number,
    beat_rent_13_count: number,
    higher_winrate_players: number,
    higher_game_players: number,
    total_players: number,
}

type GameStats = {
    number: number,
    victory: boolean,
    date: number,
}

const Profile: React.FC = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [stats, setStats] = useState<ProfileStats | undefined>(undefined);
    const [recentRunStats, setRecentRunStats] = useState<Array<GameStats>>([]);
    const [recentRuns, setRecentRuns] = useState<Array<RunInfo>>([]);

    useEffect(() => {
        const fetchUserName = async () => {
            const response = await fetch(`${API_ENDPOINT}/user/${userId}`);
            if (!response.ok) {
                console.log("Error fetching");
                // User didn't exist
                navigate('/');
            }
            const jsonData = await response.json();
            setName(jsonData.username);
        }

        fetchUserName().catch(console.error);
    }, [userId, navigate]);

    useEffect(() => {
        const fetchUserStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/user/${userId}/stats`);
            if (!response.ok) {
                console.log("Error fetching");
                // User didn't exist
                navigate('/');
            }
            const jsonData = await response.json();
            setStats(jsonData.stats[0]);
            setRecentRunStats(jsonData.runs);
        }

        fetchUserStats().catch(console.error);
    }, [navigate, userId]);

    useEffect(() => {
        const fetchRecentRuns = async () => {
            const response = await fetch(`${API_ENDPOINT}/user/${userId}/recentRuns`);
            if (!response.ok) {
                console.log("Error fetching");
                // User didn't exist
            }
            const jsonData = await response.json();
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

        fetchRecentRuns().catch(console.error);
    }, [userId]);

    return <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={4}>
            <Typography variant="h4">
                Profile
            </Typography>
        </Grid>
        <Grid item xs={8}>
            <Typography variant="h5">
                Winrate Details
            </Typography>
        </Grid>
        <Grid item xs={4} alignSelf="start">
            <Typography variant="h3">
                <Box component="img" style={{ width: "80px", marginRight: 20 }} src={SYMBOL_TO_IMG.get(Symbol.Billionaire)} />
                {name}
            </Typography>
            {stats ? standardCard("Recent Winrate", `${calculateRecentWinrate(recentRunStats)}%`, "Last 50 games") : null}
            {stats ? standardCard("Overall Winrate", `${(100 * stats.wins / stats.total_games).toFixed(1)}%`, `${ordinal(stats.higher_winrate_players + 1)} of ${stats.total_players} players`) : null}
            {stats ? standardCard("Games", `${stats.total_games}`, `${ordinal(stats.higher_game_players + 1)} of ${stats.total_players} players`) : null}
            {stats ? standardCard("Landlord Executions", `${stats.guillotines}`, `Only includes floor 20 executions`) : null}
        </Grid>
        <Grid item xs={8} alignSelf="start">
            <Grid container>
                <Grid item xs={6}>
                    {stats ?
                        <Card sx={{ mb: 1, ml: 3, mr: 3 }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                                    Winrate by rent beaten
                                </Typography>
                                {winrateAfterRentGraph(stats)}
                            </CardContent>
                        </Card>
                        : null}
                </Grid>
                <Grid item xs={6}>
                    {stats ?
                        <Card sx={{ mb: 1, ml: 3, mr: 3 }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                                    Winrate over time (50 game window)
                                </Typography>
                                {winrateOverTimeGraph(recentRunStats)}
                            </CardContent>
                        </Card>
                        : null}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        Recent Runs
                    </Typography>
                    <DisplayRuns runs={recentRuns} omitDuration />
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={12}>
            <Box height={10} />
        </Grid>
    </Grid>;
}

function standardCard(title: string, value: string, subtext: string): JSX.Element {
    return <Card sx={{ mb: 1, ml: 3, mr: 3, height: 144 }}>
        <CardContent>
            <Typography sx={{ fontSize: 25 }} color="text.secondary" gutterBottom lineHeight={.3}>
                {title}
            </Typography>
            <Typography variant="h3" lineHeight={.5}>
                {value}
            </Typography>
            <Typography sx={{ display: "inline-block", mx: "50px" }} color="text.secondary">
                {subtext}
            </Typography>
        </CardContent>
    </Card>
}

function calculateRecentWinrate(games: Array<GameStats>): string {
    if (games.length === 0) {
        return "";
    }

    let wins = 0;
    let total = 0;
    for (const game of games.slice(0, 50)) {
        if (game.victory) {
            wins += 1;
        }
        total += 1;
    }

    return (100 * wins / total).toFixed(1);
}

function winrateAfterRentGraph(stats: ProfileStats): JSX.Element {
    const xAxis = [];
    for (let i = 0; i < 13; i++) {
        xAxis.push(i);
    }
    const data = [
        (100 * stats.wins / stats.total_games),
        (100 * stats.wins / stats.beat_rent_1_count),
        (100 * stats.wins / stats.beat_rent_2_count),
        (100 * stats.wins / stats.beat_rent_3_count),
        (100 * stats.wins / stats.beat_rent_4_count),
        (100 * stats.wins / stats.beat_rent_5_count),
        (100 * stats.wins / stats.beat_rent_6_count),
        (100 * stats.wins / stats.beat_rent_7_count),
        (100 * stats.wins / stats.beat_rent_8_count),
        (100 * stats.wins / stats.beat_rent_9_count),
        (100 * stats.wins / stats.beat_rent_10_count),
        (100 * stats.wins / stats.beat_rent_11_count),
        (100 * stats.wins / stats.beat_rent_12_count)
    ];

    const chart = <LineChart
        xAxis={[{ data: xAxis, id: "rents" }]}
        yAxis={[{ min: 0, max: 100 }]}
        series={[
            {
                data: data,
                color: "#ff8300",
            }
        ]}
        bottomAxis={{
            label: "Rent",
            labelStyle: {
                fontSize: 30
            },
            tickSize: 6,
            tickLabelStyle: {
                fontSize: 30,
            },
            axisId: "rents"
        }}
        height={400}
        width={430}
    />;

    return chart;
}

function winrateOverTimeGraph(runs: Array<GameStats>): JSX.Element {
    const xAxis = [];

    let WINDOW_SIZE = 40;
    let RESOLUTION = 10;
    if (runs.length < 2 * WINDOW_SIZE) {
        WINDOW_SIZE = 20;
        RESOLUTION = 5;
    }
    if (runs.length < 2 * WINDOW_SIZE) {
        WINDOW_SIZE = 10;
        RESOLUTION = 4;
    }

    const data = [];
    let runCount = 0;
    let winCount = 0;
    for (let i = 0; i < runs.length; i++) {
        if (runCount == WINDOW_SIZE) {
            if (i % RESOLUTION == 0) {
                data.push(100 * winCount / runCount);
                xAxis.push(new Date(runs[i - 1].date).toDateString());
            }
            runCount -= 1;
            if (runs[i - WINDOW_SIZE].victory) {
                winCount -= 1;
            }
        }

        runCount += 1;
        if (runs[i].victory) {
            winCount += 1;
        }
    }

    // The data is sorted oldest to newest
    data.reverse();
    xAxis.reverse();


    const chart = <LineChart
        xAxis={[{ data: xAxis, scaleType: "band" }]}
        yAxis={[{ min: 0, max: 100 }]}
        series={[
            {
                data: data,
                color: "#ff8300",
            }
        ]}
        bottomAxis={null}
        height={400}
        width={430}
    />;

    return chart;
}

export default Profile;