import { Box, Link } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid"
import { useEffect, useState } from "react";
import { ITEM_TO_IMG } from "../utils/item";
import { Item } from "../common/models/item";
import API_ENDPOINT from "../utils/api";

export interface EssenceStats {
    name: Item,
    win_rate: number,
    total_destroyed_games: number,
    destroyed_won_games: number,
    total_games: number,
    // Essences are technically always chosen, but this way it fits into the general tile stats interface
    chosen_won_games: number,
    chosen_games: number,
}

const columns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'Icon',
        renderCell: (params: any) => (
            <Box>
                <Box component="img" style={{ width: "50px" }} src={ITEM_TO_IMG.get(params.value)} />
                <Link href={`/essenceDetails?essence=${params.value}`}>
                    {params.value}
                </Link>
            </Box>
        )
        , minWidth: 250
    },
    { field: 'win_rate', headerName: 'Win Rate', minWidth: 150 },
    {
        field: 'destroy_rate', headerName: 'Destroy Rate', minWidth: 150, valueGetter: (params: GridValueGetterParams) =>
            (100 * params.row.total_destroyed_games / params.row.total_games).toFixed(2)
    },
    {
        field: 'destroy_win_rate', headerName: 'Destroy Win Rate', minWidth: 150, valueGetter: (params: GridValueGetterParams) =>
            (100 * params.row.destroyed_won_games / (params.row.total_destroyed_games === 0 ? 1 : params.row.total_destroyed_games)).toFixed(2)
    },
    { field: 'total_games', headerName: 'Total Games', minWidth: 150 }
]

// TODO: get into workable state in combination with backend query
export const AllEssenceStats: React.FC = () => {
    const [stats, setStats] = useState<Array<EssenceStats>>([]);

    useEffect(() => {
        const fetchItemStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/essenceStats`);
            if (!response.ok) {
                console.log(`Error fetching essence stats`);
            }
            const jsonData = await response.json();
            setStats(jsonData);
        }

        fetchItemStats().catch(console.error);
    }, [])

    return (
        <div>
            <DataGrid
                rows={stats}
                columns={columns}
                getRowId={(x: EssenceStats) => x.name}
            />
        </div>
    );
}

export default AllEssenceStats;