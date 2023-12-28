import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RunDetails, RunInfo, SpinData, SpinItem, SpinSymbol } from "../common/models/run";
import { Symbol, SymbolUtils } from "../common/models/symbol";
import { Box, Button, Grid, Typography } from "@mui/material";
import GameBoard from "../components/GameBoard";
import { enqueueSnackbar } from "notistack";
import SymImg from "../components/SymImg";
import { getRentDue } from "../utils/runUtils";
import CoinChart from "../components/CoinChart";
import CumulativeCoinChart from "../components/CumulativeCoinChart";
import CoinBreakdownChart from "../components/CoinBreakdownChart";
import API_ENDPOINT from "../utils/api";

const RunReplay: React.FC = () => {
    const runRef = useRef<Element>();
    const [searchParams, setSearchParams] = useSearchParams();
    const { runId, userId, runNumber } = useParams();


    const navigate = useNavigate();
    const [name, setName] = useState<string>("");

    let startingUID = userId !== undefined ? Number(userId) : undefined;
    const [UID, setUID] = useState<number | undefined>(startingUID);

    let startingSpinIdx = 0;
    let searchParamSpin = searchParams.get("spin");
    if (searchParamSpin !== null && !isNaN(Number(searchParamSpin as any))) {
        startingSpinIdx = Number(searchParamSpin);
    }
    const [spinIdx, setSpinIdx] = useState<number>(startingSpinIdx);
    const [postEffects, setPostEffects] = useState<boolean>(false);
    const [displayCoins, setDisplayCoins] = useState<boolean>(false);

    const [runInfo, setRunInfo] = useState<RunInfo | undefined>(undefined);

    useEffect(() => {
        let fetchUrl = "";
        if (runId !== undefined) {
            fetchUrl = `${API_ENDPOINT}/run/${runId}`
        } else {
            fetchUrl = `${API_ENDPOINT}/user/${userId}/run/${runNumber}`
        }

        const fetchRunData = async () => {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                console.log("Error fetching");
                if (response.status === 404) {
                    enqueueSnackbar("Run does not exist", {
                        variant: "error",
                        style: { fontSize: 35 }
                    });
                } else {
                    enqueueSnackbar("Unknown error fetching run", {
                        variant: "error",
                        style: { fontSize: 35 }
                    });
                }
                navigate('/')
                // Run didn't exist
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
            console.log("jsonData", jsonData);
            const spins: SpinData[] = jsonData.Spins.map((s: any) => JSON.parse(s.FullSpinData));
            spins.sort((s1, s2) => s1.number - s2.number);
            details.spins = spins;
            details.symbolDetails = new Map();
            jsonData.SymbolDetails.forEach((s: any) => {
                details.symbolDetails.set(s.symbol, {
                    totalCoins: s.value,
                    totalShows: s.count,
                    addedByChoice: s.addedByChoice,
                    addedByEffect: s.addedByEffect,
                    timesRemovedByEffect: s.timesRemovedByEffect,
                    timesDestroyedByEffect: s.timesDestroyedByEffect,
                    // This will not be fully accurate
                    timesRemovedByPlayer: s.timesREmovedByPlayer,
                    timesAddedChoiceByRent: [],
                    coinsByRentPayment: [],
                    ...(s.earliestRentAdded !== null && { earliestRentAdded: s.earliestRentAdded }),
                })
            });
            // TODO: Add symbol/item details to this

            setRunInfo(runInfo);
            setSpinIdx(startingSpinIdx);
            setUID(jsonData.UserId);

            fetch(`${API_ENDPOINT}/user/${jsonData.UserId}`).then((response) => {
                if (!response.ok) {
                    console.log("Error fetching username.")
                }

                response.json().then((v) => setName(v.username))
            })
        }

        fetchRunData().catch(console.error)
    }, [runId, userId, runNumber, navigate, startingSpinIdx]);

    const toggleCoins = useCallback(() => {
        if (!displayCoins) {
            setPostEffects(true);
        }
        setDisplayCoins(!displayCoins);
    }, [displayCoins]);

    const updateSpin = useCallback((number: number) => {
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
        setDisplayCoins(false);
    }, [runInfo]);

    const keyListener = useCallback((event) => {
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
        } else if (event.key === "c") {
            toggleCoins();
        } else if (event.key === "e") {
            if (postEffects) {
                setDisplayCoins(false);
            }
            setPostEffects(!postEffects);
        } else if (event.key === "v") {
            runRef.current?.scrollIntoView({ block: "start", inline: "nearest", behavior: "smooth" });
        }
    }, [spinIdx, postEffects, updateSpin, toggleCoins]);

    useEffect(() => {
        document.addEventListener("keydown", keyListener, false);

        return () => {
            document.removeEventListener("keydown", keyListener, false);
        };
    }, [keyListener]);

    useEffect(() => {
        setSearchParams({ spin: String(spinIdx) });
    }, [spinIdx, setSearchParams])


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

            <Box alignItems="center" justifyContent="center" minWidth="100vw" display="flex" minHeight="100vh" sx={{ backgroundColor: "#ff8300" }} ref={runRef}>
                <Grid container justifyContent="center" alignItems="center" spacing={1} direction="column">
                    <Grid item xs={12} >
                        <Typography variant="h4">
                            {
                                UID !== undefined ?
                                    <Button onClick={() => { navigate(`/user/${UID}/run/${runInfo.number - 1}`); setRunInfo(undefined); }} variant="contained" sx={{ marginRight: "20px" }}>
                                        Previous Run
                                    </Button> : null
                            }
                            Run #{runInfo.number} by {name}
                            {
                                UID !== undefined ?
                                    <Button onClick={() => { navigate(`/user/${UID}/run/${runInfo.number + 1}`); setRunInfo(undefined); }} variant="contained" sx={{ marginLeft: "20px" }}>
                                        Next Run
                                    </Button> : null
                            }
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
                                    Spin {runInfo.details.spins[spinIdx].number + 1} of {runInfo.spins + 1}
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
                    <Grid item xs={12}><Grid container spacing={5} justifyContent="space-around">
                        <Grid item>
                            {getFirstItemDisplay(runInfo.details.spins[spinIdx], postEffects)}
                        </Grid>
                        <Grid item minWidth={`${8 * 76}px`}>
                            <GameBoard pxSize={8} symbols={getSpinSymbols()} coins={runInfo.details.spins[spinIdx].symbolValues} displayCoins={displayCoins} />
                        </Grid>
                        <Grid item>
                            {getSecondItemDisplay(runInfo.details.spins[spinIdx], postEffects)}
                        </Grid>
                    </Grid></Grid>
                    <Grid item xs={12} alignSelf="start" marginLeft="50px" marginTop={postEffects ? "-100px" : "-110px"}>
                        {getCoinDisplay(runInfo, postEffects, spinIdx)}
                    </Grid>
                    <Grid container justifyContent="center" spacing={3}>
                        <Grid item>
                            <Button onClick={() => setPostEffects(!postEffects)} variant="contained">
                                {postEffects ? "Toggle effects" : "Toggle effects"}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={toggleCoins} variant="contained">
                                Toggle Coins
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Typography variant="h2">
                Run Stats
            </Typography>
            <Grid container justifyContent="center" alignItems="center" direction="column">
                <Grid item>
                    <Typography variant="h4" color={runInfo.victory ? "green" : "red"}>
                        {runInfo.victory ? "Victory" : `Defeat after ${runInfo.spins} spins`}
                    </Typography>
                    {
                        runInfo.guillotine ?
                            <Typography variant="h4" color="orange">
                                Guillotine
                            </Typography> : null
                    }
                </Grid>
                <Grid item>
                    <CoinChart runInfo={runInfo} />
                </Grid>
                <Grid item>
                    <CumulativeCoinChart runInfo={runInfo} />
                </Grid>
                <Grid item>
                    <CoinBreakdownChart runInfo={runInfo} />
                </Grid>
            </Grid>
        </Box >
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
        <Typography component="div" variant="h5" color={dueColor} marginRight="10px">({(total - dueInfo.due)})</Typography>
    const dueDisplay = (
        <Typography component="div" variant="h5" marginLeft="30px" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
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