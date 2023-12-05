import { Box, TableCell, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { SYMBOL_RARITIES, Symbol } from "../common/models/symbol";

interface SymbolStatsDisplayProps {
    symbol: Symbol
}

interface SymbolStats {
    wins: number,
    total_coins: number,
    total_shows: number,
    total_games: number,
}

const SymbolStatDisplay: React.FC<SymbolStatsDisplayProps> = ({ symbol }) => {

    const [stats, setStats] = useState<SymbolStats | null>(null);

    useEffect(() => {
        const fetchSymbolStats = async () => {
            const response = await fetch(`http://localhost:3001/symbol/${symbol}/stats`);
            if (!response.ok) {
                console.log(`Error fetching for ${symbol}`);
                // User didn't exist
            }
            const jsonData = await response.json();
            setStats(jsonData[0]);
        }

        fetchSymbolStats().catch(console.error);
    })

    if (stats !== null && stats.total_games == 0) {
        return null;
    }

    return stats && (<TableRow key={symbol}>
        <TableCell><Box component="img" style={{ width: "50px" }} src={SYMBOL_TO_IMG.get(symbol)} />{symbol}</TableCell>
        <TableCell>{SYMBOL_RARITIES[symbol]}</TableCell>
        <TableCell>{stats.wins / stats.total_games} </TableCell>
        <TableCell>{stats.total_games}</TableCell>
        <TableCell>{stats.total_shows / stats.total_games}</TableCell>
    </TableRow>);
}

export default SymbolStatDisplay;