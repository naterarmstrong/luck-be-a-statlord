import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, CardMedia, Grid, ListItem, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, styled } from "@mui/material";
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

const UploadRuns: React.FC = () => {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);
    const [processedRuns, setProcessedRuns] = useState<Array<RunInfo>>([]);
    const [duplicates, setDuplicates] = useState<Array<string>>([]);

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
        }
        setProcessedRuns(runs);

        // TODO: chunk upload in groups of 100, have server send back how many were new
        const fetchArgs = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(runs, replacer),
            credentials: "include" as RequestCredentials,
            mode: "cors" as RequestMode
        };
        const response = await fetch('http://localhost:3001/uploadRuns', fetchArgs);
        const body = await response.json();

        if (body.successes > 0) {
            enqueueSnackbar(`Uploaded ${body.successes} run${body.successes > 1 ? "s" : ""}!`, {
                variant: "success",
                style: { fontSize: 35 }
            });
        }
        if (body.duplicateCount && body.duplicateCount > 0) {
            enqueueSnackbar(`${body.duplicateCount} duplicate run${body.duplicateCount > 1 ? "s were" : " was"} ignored.`, {
                variant: "error",
                style: { fontSize: 35 }
            });
            setDuplicates(body.duplicates);
        }
        // TODO: Actually send over processed run information to the server
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
                    Process Runs
                </Button>
            </Grid>
            <Box width="100%" />
            {processedRuns.length > 0 && <DisplayRuns runs={processedRuns} />}
        </Grid >
    );
};

export default UploadRuns;