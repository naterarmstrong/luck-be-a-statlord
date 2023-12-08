import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, CardMedia, Grid, LinearProgress, ListItem, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, styled } from "@mui/material";
import React from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Symbol } from "../common/models/symbol"
import { RunInfo } from "../common/models/run"
import { processRun } from "../utils/processRun";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { getOperatingSystem } from "../utils/os";
import { replacer } from "../common/utils/mapStringify"
import { msToTime } from "../common/utils/time";
import { enqueueSnackbar } from "notistack";
import DisplayRuns from "../components/DisplayRuns";
import { pauseExecution } from "../utils/yield";

const confirm = require('../img/confirm.png');
const dud = require('../img/dud.png');

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface ProgressInfo {
    state: string,
    done: number,
    active: number,
    total: number,
}

function getProgressValue(progress: ProgressInfo): number {
    return (progress.state === "Uploading" ? 50 : 0) + 50 * progress.done / progress.total;
}

function getProgressBuffer(progress: ProgressInfo): number {
    return (progress.state === "Uploading" ? 50 : 0) + 50 * (progress.done + progress.active) / progress.total;
}

const UploadRuns: React.FC = () => {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);
    const [processedRuns, setProcessedRuns] = useState<Array<RunInfo>>([]);
    const [duplicates, setDuplicates] = useState<Array<string>>([]);
    const [progress, setProgress] = useState<ProgressInfo | null>(null)

    const os = getOperatingSystem();

    const selectFiles = (event: any) => {
        const fList: Array<File> = Array.from(event.target.files);
        const newFiles = [...selectedFiles, ...fList];
        // TODO: fix this to not allow duplicates here based on filenames
        setSelectedFiles(newFiles);
        console.log(newFiles)
    }

    const getRunDate = (date: number): string => {
        const d = new Date(date);
        return d.toLocaleString('default', { month: 'short', day: 'numeric' });
    }

    const processRuns = async () => {
        const runs = [];
        let i = 0;
        for (const file of selectedFiles) {
            const text = await file.text();
            console.log(`Processing run ${file.name}`);
            try {
                const processed = processRun(text);
                var outcome: string;
                if (processed.victory) {
                    outcome = "success";
                } else {
                    outcome = "failure";
                }
                runs.push(processed);
                // console.log(`Run ${processed.number} was a ${outcome}`);
            } catch (error) {
                console.error(`Failed to process run ${file.name} for reason ${error}`)
                continue
            }

            i += 1;
            const chunk_size = 50;
            if (i % chunk_size === 0) {
                setProgress({
                    state: "Processing",
                    done: i,
                    active: chunk_size,
                    total: selectedFiles.length,
                });
                await pauseExecution();
            }
        }
        setProcessedRuns(runs);

        let successes = 0;
        let duplicateCount = 0;
        let duplicateList: string[] = [];

        const chunk_size = 100;
        const chunks = Math.ceil(runs.length / 100);
        setProgress({
            state: "Uploading",
            done: successes,
            active: chunk_size,
            total: runs.length,
        });
        for (let i = 0; i < chunks; i++) {
            const fetchArgs = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(runs.slice(chunk_size * i, chunk_size * (i + 1)), replacer),
                credentials: "include" as RequestCredentials,
                mode: "cors" as RequestMode
            };
            const response = await fetch('http://localhost:3001/uploadRuns', fetchArgs);
            const body = await response.json();
            successes += body.successes;
            duplicateCount += body.duplicateCount ?? 0;
            if (body.duplicates) {
                duplicateList.push(...body.duplicates);
            }
            setProgress({
                state: "Uploading",
                done: successes,
                active: chunk_size,
                total: runs.length,
            });
        }

        setProgress(null);
        if (successes > 0) {
            enqueueSnackbar(`Uploaded ${successes} run${successes > 1 ? "s" : ""}!`, {
                variant: "success",
                style: { fontSize: 35 }
            });
        }
        if (duplicateCount && duplicateCount > 0) {
            enqueueSnackbar(`${duplicateCount} duplicate run${duplicateCount > 1 ? "s were" : " was"} ignored.`, {
                variant: "error",
                style: { fontSize: 35 }
            });
            setDuplicates(duplicateList);
        }
    }

    const showTips = () => (
        <Grid item>
            <Typography>
                {os === "Unknown" ? "Runs are located at different locations on different operating systems." : null}
                <Box width="100%" />
                {os === "Windows" || os === "Unknown" ? "Windows runs are at `%USERPROFILE/AppData/Roaming/Godot/app_userdata/Luck be a Landlord/run_logs`" : null}
                <Box width="100%" />
                {os === "Mac" || os === "Unknown" ? "Mac runs are at `~/Library/Application Support/Godot/app_userdata/Luck be a Landlord/run_logs`" : null}
                <Box width="100%" />
                {os === "Mac" || os === "Unknown" ? "You will need hidden files visible (CMD+SHIFT+.) to see Library." : null}
                <Box width="100%" />
                {os === "Linux" || os === "Unknown" ? "Linux runs are at `~/.local/share/godot/app_userdata/Luck be a Landlord/run_logs`" : null}
            </Typography>
        </Grid>
    );


    return (
        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ overflowY: "scroll" }} >
            {showTips()}
            <Box width="100%" />
            <Grid item>
                <Box width="100%" maxWidth={600} display="flex" gap={1} marginTop={1}>
                    <Button
                        size="small"
                        component="label"
                        variant="outlined"
                        sx={{ minWidth: 100 }}
                        startIcon={<CloudUploadIcon />}
                    >
                        Choose Runs
                        <VisuallyHiddenInput type="file" onChange={selectFiles} multiple />
                    </Button>
                </Box>
            </Grid>
            <Grid item>
                {selectedFiles.length > 0 && selectedFiles.length <= 5 && selectedFiles.map((file, index) => (
                    <ListItem
                        divider
                        key={index}>
                        {file.name} played on {getRunDate(file.lastModified)}
                    </ListItem>
                ))}
                {selectedFiles.length > 5 && (<Typography> {selectedFiles.length} runs selected </Typography>)}
            </Grid>
            <Grid item>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={processRuns}
                    disabled={selectedFiles.length === 0}
                >
                    Process and Upload Runs
                </Button>
            </Grid>
            <Box width="100%" />
            <Grid xs item>
                {progress !== null ? `${progress.state}: (${progress.done}/${progress.total})` : null}
                {progress !== null ? <LinearProgress variant="buffer" value={getProgressValue(progress)} valueBuffer={getProgressBuffer(progress)} color={"warning"} /> : null}
            </Grid>
            <Box width="100%" />
            {processedRuns.length > 0 && <DisplayRuns runs={processedRuns} />}
        </Grid >
    );
};

export default UploadRuns;