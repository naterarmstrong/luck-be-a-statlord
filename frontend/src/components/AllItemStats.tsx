import { Box, Link } from "@mui/material";
import { Rarity, rarityColor } from "../common/models/rarity";
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react";
import { ITEM_TO_IMG } from "../utils/item";
import { Item } from "../common/models/item";
import API_ENDPOINT from "../utils/api";

export interface ItemStats {
    name: Item,
    rarity: Rarity,
    win_rate: number,
    total_games: number,
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
                <Link href={`/itemDetails?item=${params.value}`}>
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
    { field: 'total_games', headerName: 'Total Games', minWidth: 150 }
]

// TODO: get into workable state in combination with backend query
export const AllItemStats: React.FC = () => {
    const [stats, setStats] = useState<Array<ItemStats>>([]);

    useEffect(() => {
        const fetchItemStats = async () => {
            const response = await fetch(`${API_ENDPOINT}/itemStats`);
            if (!response.ok) {
                console.log(`Error fetching item stats`);
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
                getRowId={(x: ItemStats) => x.name}
            />
        </div>
    );
}

export default AllItemStats;