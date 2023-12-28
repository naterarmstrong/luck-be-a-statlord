import { Divider, Grid, } from "@mui/material";
import SymImg from "./SymImg";
import React from "react";
import { EarnedValue, SpinSymbol } from "../common/models/run";

// The size of one block pixel in the run
const PX_PER_IMG = 12;

export interface GameBoardProps {
    symbols: Array<SpinSymbol>,
    coins?: Array<EarnedValue>,
    displayCoins?: boolean,
    pxSize: number
}

const GameBoard: React.FC<GameBoardProps> = ({ symbols, pxSize, coins, displayCoins }) => {
    return (
        <Grid alignItems="center" justifyContent="center" container maxWidth={pxSize * PX_PER_IMG * 5 + pxSize * 16} rowSpacing={`${.6 * pxSize}px`} style={{ background: "white", border: `${pxSize}px solid black` }}>
            <RunDisplayRow top symbols={symbols.slice(0, 5)} pxSize={pxSize} coins={coins?.slice(0, 5)} displayCoins={displayCoins} />
            <RunDisplayRow symbols={symbols.slice(5, 10)} pxSize={pxSize} coins={coins?.slice(5, 10)} displayCoins={displayCoins} />
            <RunDisplayRow symbols={symbols.slice(10, 15)} pxSize={pxSize} coins={coins?.slice(10, 15)} displayCoins={displayCoins} />
            <RunDisplayRow bottom symbols={symbols.slice(15, 20)} pxSize={pxSize} coins={coins?.slice(15, 20)} displayCoins={displayCoins} />
        </Grid>
    );
}

interface RunDisplayRowProps {
    top?: boolean,
    bottom?: boolean,
    symbols: Array<SpinSymbol>,
    coins?: Array<EarnedValue>,
    displayCoins?: boolean,
    pxSize: number,
}

const RunDisplayRow: React.FC<RunDisplayRowProps> = ({ top, bottom, symbols, pxSize, coins, displayCoins }) => {
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

    let getCoins = (i: number): EarnedValue | undefined => {
        if (!displayCoins || !coins) {
            return undefined;
        }
        return coins[i];
    }

    return (
        <React.Fragment>
            <Grid item xs={2.4} sx={{ mr: `${pxSize / 4}px`, ml: `-${pxSize / 4}px` }}>
                <SymImg size={PX_PER_IMG * pxSize} tile={symbols[0]} style={symImgStyle} earned={getCoins(0)} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={middleGISx}>
                <SymImg size={PX_PER_IMG * pxSize} tile={symbols[1]} style={symImgStyle} earned={getCoins(1)} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={middleGISx}>
                <SymImg size={PX_PER_IMG * pxSize} tile={symbols[2]} style={symImgStyle} earned={getCoins(2)} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={middleGISx}>
                <SymImg size={PX_PER_IMG * pxSize} tile={symbols[3]} style={symImgStyle} earned={getCoins(3)} />
            </Grid>
            {getDivider()}
            <Grid item xs={2.4} sx={{ mr: `-${pxSize / 4}px`, ml: `${pxSize / 4}px` }}>
                <SymImg size={PX_PER_IMG * pxSize} tile={symbols[4]} style={symImgStyle} earned={getCoins(4)} />
            </Grid>
        </React.Fragment>
    );
}

export default GameBoard;