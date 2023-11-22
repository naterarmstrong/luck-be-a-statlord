import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, CardMedia, Grid, ListItem, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, styled } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ProcessedRun, msToTime, processRun } from "../utils/processRun";
import { IIDToSymbol, SYMBOL_TO_IMG, Symbol } from "../utils/symbol";

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
    const [processedRuns, setProcessedRuns] = useState<Array<ProcessedRun>>([]);

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
                console.log(`Run ${processed.number} was a ${outcome}`);
            } catch (error) {
                console.error(`Failed to process run ${file.name} for reason ${error}`)
                continue
            }
        }
        setProcessedRuns(runs);
        // TODO: Actually send over processed run information to the server
    }


    return (
        <Grid container spacing={2} alignItems="center" justifyContent="center" >
            <Grid item>
                <Typography>
                    Runs are located at different locations on different operating systems. <br />

                    Windows: `%USERPROFILE/AppData/Roaming/Godot/app_userdata/Luck be a Landlord/run_logs`<br />

                    Mac: `~/Library/Application Support/Godot/app_userdata/Luck be a Landlord/run_logs`<br />

                    Linux: `~/.local/share/godot/app_userdata/Luck be a Landlord/run_logs`<br />
                </Typography>
            </Grid>
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
                {selectedFiles.length > 0 && selectedFiles.length < 10 && selectedFiles.map((file, index) => (
                    <ListItem
                        divider
                        key={index}>
                        {file.name} played on {getRunDate(file.lastModified)}
                    </ListItem>
                ))}
                {selectedFiles.length >= 10 && (<Typography> {selectedFiles.length} runs selected </Typography>)}
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
            {processedRuns.length > 0 &&
                <Grid item sx={{ overflowY: "scroll", maxHeight: "400px" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Run #</TableCell>
                                <TableCell>Victory</TableCell>
                                <TableCell>Date Played</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Early</TableCell>
                                <TableCell>Mid</TableCell>
                                <TableCell>End</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {processedRuns.map((run: ProcessedRun, index) => (
                                < TableRow role="checkbox" key={run.number} selected={run.victory} >
                                    <TableCell>{run.number}</TableCell>
                                    <TableCell>
                                        <Grid>
                                            <Box component="img" style={{ width: "50px" }} src={run.victory ? String(confirm) : String(dud)} />
                                            {run.guillotine ? <Box width="100%" /> : null}
                                            {run.guillotine ? <Box component="img" style={{ width: "50px" }} src={SYMBOL_TO_IMG.get(Symbol.Billionaire) /* TODO: Change this to guillotine when I add item images. */} /> : null}
                                        </Grid>
                                    </TableCell>
                                    <TableCell>{getRunDate(run.date)}</TableCell>
                                    <TableCell>{msToTime(run.duration)}</TableCell>
                                    <TableCell>
                                        <Grid>
                                            <Box component="img" style={{ width: "40px" }} src={SYMBOL_TO_IMG.get(run.earlySyms[0])} />
                                            <Box width="100%" />
                                            <Box component="img" style={{ width: "40px" }} src={SYMBOL_TO_IMG.get(run.earlySyms[1])} />
                                            <Box width="100%" />
                                            <Box component="img" style={{ width: "40px" }} src={SYMBOL_TO_IMG.get(run.earlySyms[2])} />
                                        </Grid>
                                    </TableCell>
                                    <TableCell>
                                        <Grid>
                                            <Box component="img" style={{ width: "40px" }} src={SYMBOL_TO_IMG.get(run.midSyms[0])} />
                                            <Box width="100%" />
                                            <Box component="img" style={{ width: "40px" }} src={SYMBOL_TO_IMG.get(run.midSyms[1])} />
                                            <Box width="100%" />
                                            <Box component="img" style={{ width: "40px" }} src={SYMBOL_TO_IMG.get(run.midSyms[2])} />
                                        </Grid>
                                    </TableCell>
                                    <TableCell>
                                        <Grid>
                                            <Box component="img" style={{ width: "40px" }} src={SYMBOL_TO_IMG.get(run.lateSyms[0])} />
                                            <Box width="100%" />
                                            <Box component="img" style={{ width: "40px" }} src={SYMBOL_TO_IMG.get(run.lateSyms[1])} />
                                            <Box width="100%" />
                                            <Box component="img" style={{ width: "40px" }} src={SYMBOL_TO_IMG.get(run.lateSyms[2])} />
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            }
        </Grid >
    );
};

export default UploadRuns;
