import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { RunInfo } from "../common/models/run";
import { msToTime } from "../common/utils/time";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { Symbol } from "../common/models/symbol";

const confirm = require('../img/confirm.png');
const dud = require('../img/dud.png');

export interface DisplayRunsProps {
    runs: RunInfo[]
}

const DisplayRuns: React.FC<DisplayRunsProps> = ({ runs }) => {

    const getRunDate = (date: number): string => {
        const d = new Date(date);
        return d.toLocaleString('default', { month: 'short', day: 'numeric', year: "numeric" });
    }

    return (
        <Grid item sx={{ overflowY: "scroll", maxHeight: "600px" }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Run #</TableCell>
                        <TableCell>Victory</TableCell>
                        <TableCell>Date Played</TableCell>
                        <TableCell>Spins</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Early</TableCell>
                        <TableCell>Mid</TableCell>
                        <TableCell>Final</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {runs.map((run: RunInfo, index) => (
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
                            <TableCell>{run.spins}</TableCell>
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
        </Grid>);
}

export default DisplayRuns;