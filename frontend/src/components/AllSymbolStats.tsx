import { Box } from "@mui/material";
import { Symbol } from "../common/models/symbol";
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { SymbolStats } from "./SymbolStatDisplay";

const columns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'Icon',
        renderCell: (params: any) => (
            <Box>
                <Box component="img" style={{ width: "50px" }} src={SYMBOL_TO_IMG.get(params.value)} />
                {params.value}
            </Box>
        ) // TODO: put name here too
        , minWidth: 250
    },
    { field: 'rarity', headerName: 'Rarity', minWidth: 150 },
    { field: 'win_rate', headerName: 'Win Rate', minWidth: 150 },
    { field: 'total_games', headerName: 'Total Games', minWidth: 150 },
    { field: 'total_shows', headerName: 'Shows per Game', minWidth: 150 }
]

type AllSymbolStatsProps = {
    stats: Array<SymbolStats>
}

// TODO: get into workable state in combination with backend query
export const AllSymbolStats: React.FC<AllSymbolStatsProps> = ({ stats }) => {
    return (
        <div style={{ height: 400 }} >
            <DataGrid
                rows={stats}
                columns={columns}
                getRowId={(x: SymbolStats) => x.name}
            />
        </div>
    );
}

export default AllSymbolStats;