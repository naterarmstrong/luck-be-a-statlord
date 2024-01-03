import { Box, Grid, Link, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { RunInfo } from "../common/models/run";
import { msToTime } from "../common/utils/time";
import { Item } from "../common/models/item";
import { ITEM_TO_IMG } from "../utils/item";
import { useContext } from "react";
import userContext from "../contexts/UserContext";
import SymImg from "./SymImg";
import { Symbol } from "../common/models/symbol";

const confirm = require('../img/confirm.png');
const dud = require('../img/dud.png');

export interface DisplayRunsProps {
    runs: RunInfo[],
    omitDuration?: boolean,
    unlimitedHeight?: boolean,
}

const DisplayRuns: React.FC<DisplayRunsProps> = ({ runs, omitDuration, unlimitedHeight }) => {
    const { userId } = useContext(userContext);

    const getRunDate = (date: number): string => {
        const d = new Date(date);
        return d.toLocaleString('default', { month: 'short', day: 'numeric', year: "numeric" });
    }

    let sx = {};
    if (!unlimitedHeight) {
        sx = { overflowY: "scroll", maxHeight: "600px" }
    }

    return (
        <Grid item sx={sx}>
            <Table>
                <TableHead>
                    <TableRow>
                        {runs.at(0)?.authorInfo !== undefined ? <TableCell sx={{ maxWidth: 150 }}>User</TableCell> : null}
                        <TableCell>Run #</TableCell>
                        <TableCell>Victory</TableCell>
                        <TableCell>Date Played</TableCell>
                        <TableCell>Spins</TableCell>
                        {omitDuration ? null : <TableCell>Duration</TableCell>}
                        <TableCell>Early</TableCell>
                        <TableCell>Mid</TableCell>
                        <TableCell>Final</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {runs.map((run: RunInfo, index) => (
                        < TableRow role="checkbox" key={run.number} selected={run.victory} >
                            {run.authorInfo !== undefined ?
                                <TableCell>{run.authorInfo.username}</TableCell> : null
                            }
                            <TableCell>
                                <Link href={`/user/${run.authorInfo !== undefined ? run.authorInfo.userId : userId}/run/${run.number}`}>
                                    {run.number}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Grid>
                                    <Box component="img" style={{ width: "50px" }} src={run.victory ? String(confirm) : String(dud)} />
                                    {run.guillotine ? <Box width="100%" /> : null}
                                    {run.guillotine ? <Box component="img" style={{ width: "50px" }} src={ITEM_TO_IMG.get(Item.Guillotine) /* TODO: Change this to guillotine when I add item images. */} /> : null}
                                </Grid>
                            </TableCell>
                            <TableCell>{getRunDate(run.date)}</TableCell>
                            <TableCell>{run.spins}</TableCell>
                            {omitDuration ? null : <TableCell>{msToTime(run.duration)}</TableCell>}
                            <TableCell>
                                <Grid>
                                    <SymImg tile={run.earlySyms[0] ?? Symbol.Empty} />
                                    <Box width="100%" />
                                    <SymImg tile={run.earlySyms[1] ?? Symbol.Empty} />
                                    <Box width="100%" />
                                    <SymImg tile={run.earlySyms[2] ?? Symbol.Empty} />
                                </Grid>
                            </TableCell>
                            <TableCell>
                                <Grid>
                                    <SymImg tile={run.midSyms[0] ?? Symbol.Empty} />
                                    <Box width="100%" />
                                    <SymImg tile={run.midSyms[1] ?? Symbol.Empty} />
                                    <Box width="100%" />
                                    <SymImg tile={run.midSyms[2] ?? Symbol.Empty} />
                                </Grid>
                            </TableCell>
                            <TableCell>
                                <Grid>
                                    <SymImg tile={run.lateSyms[0] ?? Symbol.Empty} />
                                    <Box width="100%" />
                                    <SymImg tile={run.lateSyms[1] ?? Symbol.Empty} />
                                    <Box width="100%" />
                                    <SymImg tile={run.lateSyms[2] ?? Symbol.Empty} />
                                </Grid>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Grid>);
}

export default DisplayRuns;