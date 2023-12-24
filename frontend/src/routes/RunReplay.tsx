import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RunDetails, RunInfo, SpinData } from "../common/models/run";
import { Symbol } from "../common/models/symbol";
import { Box, Button, Grid, Typography } from "@mui/material";
import GameBoard from "../components/GameBoard";

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

            fetch(`http://localhost:3001/user/${jsonData.UserId}`).then((response) => {
                if (!response.ok) {
                    console.log("Error fetching username.")
                }

                response.json().then((v) => setName(v.username))
            })
        }

        fetchRunData().catch(console.error)
    }, []);

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

    if (!runInfo || !runInfo.details) {
        return <Typography variant="h3">
            Loading Run...
        </Typography>
    }


    return (
        <Box alignItems="center" justifyContent="center" width="100vw" display="flex" minHeight="100vh" sx={{ backgroundColor: "#ff8300" }}>
            <Grid container justifyContent="center" alignItems="center" spacing={0} direction="column">
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
                                Spin {runInfo.details.spins[spinIdx].number} of {runInfo.spins}
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
                        <Grid item>
                            <Button onClick={() => setPostEffects(!postEffects)} variant="contained">
                                {postEffects ? "Pre-Effects" : "Post-Effects"}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <GameBoard pxSize={8} symbols={postEffects ? runInfo.details!.spins[spinIdx].postEffectLayout : runInfo.details!.spins[spinIdx].preEffectLayout} />
                </Grid>
            </Grid>
        </Box>
    );
}

export default RunReplay;