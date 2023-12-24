import { Box, Divider, Grid, GridProps, styled } from "@mui/material";
import SymImg from "./SymImg";
import { Symbol } from "../common/models/symbol";
import React, { useEffect } from "react";
import { SpinSymbol } from "../common/models/run";

// The size of one block pixel in the run
const PX_PER_IMG = 12;

export interface GameBoardProps {
    symbols: Array<SpinSymbol>,
    pxSize: number
}

const GameBoard: React.FC<GameBoardProps> = ({ symbols, pxSize }) => {
    return (
        <Grid alignItems="center" justifyContent="center" container maxWidth={pxSize * PX_PER_IMG * 5 + pxSize * 16} rowSpacing={`${.6 * pxSize}px`} style={{ background: "white", border: `${pxSize}px solid black` }}>
            <RunDisplayRow top symbols={symbols.slice(0, 5)} pxSize={pxSize} />
            <RunDisplayRow symbols={symbols.slice(5, 10)} pxSize={pxSize} />
            <RunDisplayRow symbols={symbols.slice(10, 15)} pxSize={pxSize} />
            <RunDisplayRow bottom symbols={symbols.slice(15, 20)} pxSize={pxSize} />
        </Grid>
    );
}

interface RunDisplayRowProps {
    top?: boolean,
    bottom?: boolean,
    symbols: Array<SpinSymbol>,
    pxSize: number,
}

const RunDisplayRow: React.FC<RunDisplayRowProps> = ({ top, bottom, symbols, pxSize }) => {
    const widthPerGI = (PX_PER_IMG + 2) * pxSize;
    const getDivider = () => {
        return <Divider orientation="vertical" flexItem sx={{ mr: `-${pxSize / 2}px`, ml: `-${pxSize / 2}px`, border: () => `${pxSize / 2}px solid black` }} />
    }
    let symImgStyle = {};
    if (top) {
        symImgStyle = { marginTop: `${.25 * pxSize}px` }
    }
    if (bottom) {
        symImgStyle = { marginBottom: `-${pxSize / 2}px` }
    }
    const middleGISx = {
        maxWidth: `${(PX_PER_IMG + 3) * pxSize}`,
        minWidth: `${(PX_PER_IMG + 3) * pxSize}`
    }

    return (
        <React.Fragment>
            <Grid item xs={2.4} sx={{ mr: `${pxSize / 4}px`, ml: `-${pxSize / 4}px` }}>
                <SymImg size={PX_PER_IMG * pxSize} tile={symbols[0]} style={symImgStyle} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={middleGISx}>
                <SymImg size={PX_PER_IMG * pxSize} tile={symbols[1]} style={symImgStyle} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={middleGISx}>
                <SymImg size={PX_PER_IMG * pxSize} tile={symbols[2]} style={symImgStyle} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={middleGISx}>
                <SymImg size={PX_PER_IMG * pxSize} tile={symbols[3]} style={symImgStyle} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={{ mr: `-${pxSize / 4}px`, ml: `${pxSize / 4}px` }}>
                <SymImg size={PX_PER_IMG * pxSize} tile={symbols[4]} style={symImgStyle} />
            </Grid>
        </React.Fragment>
    );
}

export default GameBoard;