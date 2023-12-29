import { Box, Link } from "@mui/material";
import { Rarity, rarityColor } from "../common/models/rarity";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { useEffect, useState } from "react";
import API_ENDPOINT from "../utils/api";
import { Symbol } from "../common/models/symbol";

export interface SymbolStats {
    name: Symbol,
    rarity: Rarity,
    win_rate: number,
    total_shows: number,
    total_games: number,
}

const columns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'Icon',
        renderCell: (params: any) => (
            <Box>
                <Box component="img" style={{ width: "50px" }} src={SYMBOL_TO_IMG.get(params.value)} />
                <Link href={`/symbolDetails?symbol=${params.value}`}>
                    {params.value}
                </Link>
            </Box>
        )
        , minWidth: 250
    },
    {
        field: 'rarity', headerName: 'Rarity', minWidth: 150, renderCell: (params: any) => {
            return (
                <Box sx={{ color: rarityColor(params.value) }}>
                    {params.value}
                </Box>
            );
        }
    },
    { field: 'win_rate', headerName: 'Win Rate', minWidth: 150 },
    { field: 'total_games', headerName: 'Total Games', minWidth: 150 },
    {
        field: 'pick_rate',
        headerName: 'Pick Rate',
        minWidth: 150,
        valueGetter: (params: GridValueGetterParams) =>
            params.row.chosen_games
    },
    {
        field: 'picked_win_rate',
        headerName: 'Picked Win Rate',
        minWidth: 150,
        valueGetter: (params: GridValueGetterParams) =>
            (100 * params.row.chosen_won_games / params.row.chosen_games).toFixed(2)
    },
    { field: 'total_shows', headerName: 'Shows per Game', minWidth: 150 }
]

// TODO: get into workable state in combination with backend query
export const AllSymbolStats: React.FC = () => {
    const [stats, setStats] = useState<Array<SymbolStats>>([]);

    useEffect(() => {
        const fetchSymbolStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/symbolStats`);
            if (!response.ok) {
                console.log(`Error fetching symbol stats`);
            }
            const jsonData = await response.json();
            setStats(jsonData);
        }

        fetchSymbolStats().catch(console.error);
    }, [])

    return (
        <div>
            <DataGrid
                rows={stats}
                columns={columns}
                getRowId={(x: SymbolStats) => x.name}
            />
        </div>
    );
}

export default AllSymbolStats;