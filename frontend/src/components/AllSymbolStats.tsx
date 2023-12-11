import { Box, Link } from "@mui/material";
import { Symbol } from "../common/models/symbol";
import { Rarity, rarityColor } from "../common/models/rarity";
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { useEffect, useState } from "react";
import { SymbolStats } from "./SymbolStatDisplay";

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
        ) // TODO: put name here too
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
    { field: 'total_shows', headerName: 'Shows per Game', minWidth: 150 }
]

// TODO: get into workable state in combination with backend query
export const AllSymbolStats: React.FC = () => {
    const [stats, setStats] = useState<Array<SymbolStats>>([]);

    useEffect(() => {
        const fetchSymbolStats = async () => {
            const response = await fetch(`http://localhost:3001/symbolStats`);
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