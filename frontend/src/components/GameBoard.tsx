import { Box, Divider, Grid, GridProps, styled } from "@mui/material";
import SymImg from "./SymImg";
import { Symbol } from "../common/models/symbol";
import React from "react";
import { SpinSymbol } from "../common/models/run";

// The size of one block pixel in the run
const PX_SIZE = 10;
const PX_PER_IMG = 12;

const LBaLGrid = styled(Grid)<GridProps>(({ theme }) => ({
    background: "white",
    border: `${PX_SIZE}px solid black`
}))

export interface GameBoardProps {
    symbols: Array<SpinSymbol>
}

const GameBoard: React.FC<GameBoardProps> = ({ symbols }) => {
    return (
        <Box alignItems="center" justifyContent="center" width="100vw" display="flex" minHeight="80vh" sx={{ backgroundColor: "#ff8300" }}>
            <Box>
                <LBaLGrid alignItems="center" justifyContent="center" container maxWidth={PX_SIZE * PX_PER_IMG * 5 + PX_SIZE * 16} rowSpacing={`${.6 * PX_SIZE}px`} >
                    <RunDisplayRow top symbols={symbols.slice(0, 5)} />
                    <RunDisplayRow symbols={symbols.slice(5, 10)} />
                    <RunDisplayRow symbols={symbols.slice(10, 15)} />
                    <RunDisplayRow bottom symbols={symbols.slice(15, 20)} />
                </LBaLGrid>
            </Box>
        </Box>
    );
}

interface RunDisplayRowProps {
    top?: boolean,
    bottom?: boolean,
    symbols: Array<SpinSymbol>,
}

const RunDisplayRow: React.FC<RunDisplayRowProps> = ({ top, bottom, symbols }) => {
    const widthPerGI = (PX_PER_IMG + 2) * PX_SIZE;
    const getDivider = () => {
        return <Divider orientation="vertical" flexItem sx={{ mr: `-${PX_SIZE / 2}px`, ml: `-${PX_SIZE / 2}px`, border: () => `${PX_SIZE / 2}px solid black` }} />
    }
    let symImgStyle = {};
    if (top) {
        symImgStyle = { marginTop: `${.25 * PX_SIZE}px` }
    }
    if (bottom) {
        symImgStyle = { marginBottom: `-${PX_SIZE / 2}px` }
    }
    const middleGISx = {
        maxWidth: `${(PX_PER_IMG + 3) * PX_SIZE}`,
        minWidth: `${(PX_PER_IMG + 3) * PX_SIZE}`
    }

    return (
        <React.Fragment>
            <Grid item xs={2.4} sx={{ mr: `${PX_SIZE / 4}px`, ml: `-${PX_SIZE / 4}px` }}>
                <SymImg size={PX_PER_IMG * PX_SIZE} tile={symbols[0]} style={symImgStyle} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={middleGISx}>
                <SymImg size={PX_PER_IMG * PX_SIZE} tile={symbols[1]} style={symImgStyle} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={middleGISx}>
                <SymImg size={PX_PER_IMG * PX_SIZE} tile={symbols[2]} style={symImgStyle} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={middleGISx}>
                <SymImg size={PX_PER_IMG * PX_SIZE} tile={symbols[3]} style={symImgStyle} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={{ mr: `-${PX_SIZE / 4}px`, ml: `${PX_SIZE / 4}px` }}>
                <SymImg size={PX_PER_IMG * PX_SIZE} tile={symbols[4]} style={symImgStyle} />
            </Grid>
        </React.Fragment>
    );
}

export default GameBoard;