import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RunDetails, RunInfo, SpinData, SpinItem, SpinSymbol } from "../common/models/run";
import { Symbol, SymbolUtils } from "../common/models/symbol";
import { Box, Button, Grid, Typography } from "@mui/material";
import GameBoard from "../components/GameBoard";
import { enqueueSnackbar } from "notistack";
import SymImg from "../components/SymImg";
import { getRentDue } from "../utils/runUtils";
import { Item } from "../common/models/item";

const RunReplay: React.FC = () => {
    const { runId } = useParams();
    const [name, setName] = useState<string>("");
    const [spinIdx, setSpinIdx] = useState<number>(0);
    const [postEffects, setPostEffects] = useState<boolean>(false);

    const [runInfo, setRunInfo] = useState<RunInfo | undefined>(undefined);

    useEffect(() => {
        const fetchRunData = async () => {
            const response = await fetch(`http://localhost:3001/run/${runId}`);
            if (!response.ok) {
                console.log("Error fetching");
                // User didn't exist
            }

            const jsonData = await response.json();
            const runInfo = new RunInfo(
                jsonData.hash,
                jsonData.number,
                jsonData.version,
                jsonData.isFloor20,
                jsonData.date,
                jsonData.duration,
                jsonData.victory,
                jsonData.guillotine,
                jsonData.spins,
                jsonData.earlySyms.split(",") as Symbol[],
                jsonData.midSyms.split(",") as Symbol[],
                jsonData.lateSyms.split(",") as Symbol[],
            );
            // Spins is top-level key on json response
            // So is symbol details and itemdetails
            // Seems like details by rents is broken currently

            const details = new RunDetails();
            runInfo.details = details;
            const spins: SpinData[] = jsonData.Spins.map((s: any) => JSON.parse(s.FullSpinData));
            spins.sort((s1, s2) => s1.number - s2.number);
            details.spins = spins;
            // TODO: Add symbol/item details to this

            setRunInfo(runInfo);
            setSpinIdx(0);

            fetch(`http://localhost:3001/user/${jsonData.UserId}`).then((response) => {
                if (!response.ok) {
                    console.log("Error fetching username.")
                }

                response.json().then((v) => setName(v.username))
            })
        }

        fetchRunData().catch(console.error)
    }, []);

    const arrowKeyListener = useCallback((event) => {
        if (event.key === "ArrowRight") {
            updateSpin(spinIdx + 1);
        } else if (event.key === "ArrowLeft") {
            updateSpin(spinIdx - 1);
        } else if (event.key === "ArrowUp") {
            setPostEffects(false);
            event.preventDefault();
        } else if (event.key === "ArrowDown") {
            setPostEffects(true);
            event.preventDefault();
        }
    }, [spinIdx]);

    useEffect(() => {
        document.addEventListener("keydown", arrowKeyListener, false);

        return () => {
            document.removeEventListener("keydown", arrowKeyListener, false);
        };
    }, [arrowKeyListener]);

    const updateSpin = (number: number) => {
        if (!runInfo || !runInfo.details) {
            return;
        }

        if (number < 0) {
            setSpinIdx(0);
        } else if (number >= runInfo.details.spins.length) {
            setSpinIdx(runInfo.details.spins.length - 1);
        } else {
            setSpinIdx(number);
        }
        setPostEffects(false);
    }

    const getSpinSymbols = (): Array<SpinSymbol> => {
        if (!runInfo || !runInfo.details) {
            return [];
        }
        const spin = runInfo.details.spins[spinIdx];
        if (postEffects) {
            return spin.postEffectLayout;
        }
        // If the symbol displayed is the same in the pre and post effect layout, apply bonuses and
        // multipliers to the pre-effect layout. This is _not_ always accurate, and in particular
        // with eaters will display wrong information.
        const ret = [];
        for (let i = 0; i < 20; i++) {
            const preSymbol = spin.preEffectLayout[i];
            const postSymbol = spin.postEffectLayout[i];

            if (preSymbol.symbol !== postSymbol.symbol) {
                ret.push(preSymbol);
                continue;
            }

            const retSymbol: SpinSymbol = {
                symbol: preSymbol.symbol,
            };
            if (preSymbol.countdown !== undefined) {
                retSymbol.countdown = preSymbol.countdown;
            }
            if (postSymbol.multiplier) {
                retSymbol.multiplier = postSymbol.multiplier;
            }
            if (postSymbol.bonus && !SymbolUtils.isEater(preSymbol.symbol)) {
                retSymbol.bonus = postSymbol.bonus;
            }
            ret.push(retSymbol);
        }

        return ret;
    }


    if (!runInfo || !runInfo.details) {
        return <Typography variant="h3">
            Loading Run...
        </Typography>
    }


    return (
        <Box>

            <Box alignItems="center" justifyContent="center" width="100vw" display="flex" minHeight="100vh" sx={{ backgroundColor: "#ff8300" }}>
                <Grid container justifyContent="center" alignItems="center" spacing={1} direction="column">
                    <Grid item xs={12} >
                        <Typography variant="h4">
                            Run #{runInfo.number} by {name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container spacing={1}>
                            <Grid item>
                                <Button onClick={() => updateSpin(0)} variant="contained">
                                    First
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={() => updateSpin(spinIdx - 1)} variant="contained">
                                    Previous
                                </Button>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6">
                                    Spin {runInfo.details.spins[spinIdx].number + 1} of {runInfo.spins}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button onClick={() => updateSpin(spinIdx + 1)} variant="contained">
                                    Next
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={() => updateSpin(runInfo.details!.spins.length - 1)} variant="contained">
                                    Last
                                </Button>
                            </Grid>
                            <Grid item xs={12} />
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => setPostEffects(!postEffects)} variant="contained">
                            {postEffects ? "Pre-Effects" : "Post-Effects"}
                        </Button>
                    </Grid>
                    <Grid item xs={12}><Grid container spacing={5} justifyContent="space-around">
                        <Grid item>
                            {getFirstItemDisplay(runInfo.details.spins[spinIdx], postEffects)}
                        </Grid>
                        <Grid item minWidth={`${8 * 76}px`}>
                            <GameBoard pxSize={8} symbols={getSpinSymbols()} />
                        </Grid>
                        <Grid item>
                            {getSecondItemDisplay(runInfo.details.spins[spinIdx], postEffects)}
                        </Grid>
                    </Grid></Grid>
                    <Grid item xs={12} alignSelf="start" marginLeft="50px" marginTop="-100px">
                        {getCoinDisplay(runInfo, postEffects, spinIdx)}
                    </Grid>
                </Grid>
            </Box>
            <Typography variant="h2">
                Run Stats
            </Typography>
            This is the next thing
        </Box>
    );
}


const getCoinDisplay = (runInfo: RunInfo, postEffects: boolean, spinIdx: number) => {
    if (!runInfo || !runInfo.details) {
        return null;
    }
    const current = runInfo.details.spins[spinIdx].currentCoins;
    const earned = runInfo.details.spins[spinIdx].coinsGained;
    const total = runInfo.details.spins[spinIdx].coinTotal;

    const earnedDisplay =
        (<Typography variant="h4" style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
        }} lineHeight={0} marginBottom="-25px" marginLeft="20px">
            <SymImg tile={Symbol.Coin} style={{ display: "inline", marginRight: "5px", marginBottom: "-5px" }} /> {earned}
        </Typography>);


    const dueInfo = getRentDue(spinIdx, runInfo.details);
    const dueColor = dueInfo.due > total ? "red" : "green";
    const diffDisplay =
        <Typography variant="h5" color={dueColor} marginRight="10px">({(total - dueInfo.due)})</Typography>
    const dueDisplay = (
        <Typography variant="h5" marginLeft="30px" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {diffDisplay}
            {dueInfo.due} {dueInfo.spinsRemaining > 0 ? `in ${dueInfo.spinsRemaining}` : "now"}
        </Typography>
    );

    return (
        <React.Fragment>
            {postEffects ? null : earnedDisplay}
            <Typography variant="h3" style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
                <SymImg tile={Symbol.Coin} style={{ display: "inline", marginRight: "5px", marginBottom: "-5px" }} />
                {postEffects ? total : current - 1}
                {dueDisplay}
            </Typography>
        </React.Fragment>
    );
}

const getFirstItemDisplay = (spin: SpinData, postEffects: boolean) => {
    let items: (SpinSymbol | SpinItem)[] = [];
    if (postEffects) {
        items = [...spin.postEffectItems];
    } else {
        items = [...spin.preEffectItems];
    }

    while (items.length < 9) {
        items.push({ symbol: Symbol.Empty });
    }

    if (items.length > 9) {
        items = items.slice(0, 9);
    }

    return (<Grid container spacing={1} justifySelf="end" maxWidth={12 * 6 * 4}>
        {items.map((i) =>
            <Grid item xs={4}>
                <SymImg tile={i} size={12 * 6} />
            </Grid>)}
    </Grid>);
}

const getSecondItemDisplay = (spin: SpinData, postEffects: boolean) => {
    let items: (SpinSymbol | SpinItem)[] = [];
    if (postEffects) {
        items = [...spin.postEffectItems];
    } else {
        items = [...spin.preEffectItems];
    }

    items = items.slice(9, 18);

    while (items.length < 9) {
        items.push({ symbol: Symbol.Empty });
    }

    return (
        <Grid container spacing={1} maxWidth={12 * 6 * 4}>
            {items.map((i) =>
                <Grid item xs={4}>
                    <SymImg tile={i} size={12 * 6} />
                </Grid>)}
        </Grid>);
}

export default RunReplay;