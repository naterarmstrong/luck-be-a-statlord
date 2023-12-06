import { Box } from "@mui/material";
import { Symbol } from "../common/models/symbol";
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { SYMBOL_TO_IMG } from "../utils/symbol";

const columns: GridColDef[] = [
    {
        field: 'icon',
        headerName: 'Icon',
        sortable: false,
        renderCell: (params: any) => (<Box component="img" style={{ width: "50px" }} src={SYMBOL_TO_IMG.get(params.value)} />) // TODO: put name here too
    },
    {
        field: 'symbol',
        headerName: 'Symbol'
    },
    { field: 'rarity', headerName: 'Rarity' },
    { field: 'winRate', headerName: 'Win Rate' },
    { field: 'totalGames', headerName: 'Total Games' }
]

interface AllSymbolStatsProps {
    value: Array<SymbolStats>
}

interface SymbolStats {
    icon: Symbol,
    symbol: string,
    wins: number,
    total_coins: number,
    total_shows: number,
    total_games: number,
}

// TODO: get into workable state in combination with backend query
const AllSymbolStats: React.FC<AllSymbolStatsProps> = ({ value }) => {
    return (
        <DataGrid
            rows={value}
            columns={columns}
        />
    );
}