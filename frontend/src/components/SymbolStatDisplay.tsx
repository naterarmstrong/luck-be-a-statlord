import { Box, TableCell, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { Rarity, SYMBOL_RARITIES, Symbol } from "../common/models/symbol";

export interface SymbolStats {
    name: Symbol,
    rarity: Rarity,
    win_rate: number,
    total_shows: number,
    total_games: number,
}

const SymbolStatDisplay: React.FC<SymbolStats> = ({ name, rarity, win_rate, total_shows, total_games }) => {
    return (<TableRow key={name}>
        <TableCell><Box component="img" style={{ width: "50px" }} src={SYMBOL_TO_IMG.get(name)} />{name}</TableCell>
        <TableCell>{rarity}</TableCell>
        <TableCell>{win_rate} </TableCell>
        <TableCell>{total_games}</TableCell>
        <TableCell>{total_shows}</TableCell>
    </TableRow>);
}

export default SymbolStatDisplay;