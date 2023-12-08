import { Autocomplete, Box, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import { Symbol, isSymbol } from "../common/models/symbol";
import { useEffect, useState } from "react";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { useSearchParams } from "react-router-dom";
import SymbolSelector from "../components/SymbolSelector";


const SymbolDetails: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    let startSymbol = Symbol.Unknown;
    if (searchParams.get("symbol") !== null && isSymbol(searchParams.get("symbol") as any)) {
        startSymbol = searchParams.get("symbol") as Symbol;
    }
    const [symbol, setSymbol] = useState<Symbol>(startSymbol);

    useEffect(() => {
        setSearchParams({ symbol: symbol });
    }, [symbol])

    return <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={4}>
            <Typography variant="h4">
                Symbol Details
            </Typography>
        </Grid>
        <Grid item xs={8}>
            <SymbolSelector symbol={symbol} setSymbol={setSymbol} />
        </Grid>
    </Grid>;
}

export default SymbolDetails;