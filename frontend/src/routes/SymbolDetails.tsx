import { Autocomplete, Box, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import { Symbol, isSymbol } from "../common/models/symbol";
import { useEffect, useState } from "react";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { useSearchParams } from "react-router-dom";


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
            <Autocomplete
                disablePortal
                disableClearable
                options={Object.keys(Symbol)}
                value={symbol}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} >
                        <Box component="img" style={{ width: "40px" }} src={SYMBOL_TO_IMG.get(option as Symbol)} />
                        {option}
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <Box component="img" style={{ width: "40px" }} src={SYMBOL_TO_IMG.get(symbol)} />
                            )
                        }}
                        onChange={(e) => {
                            isSymbol(e.target.value) && setSymbol(e.target.value as Symbol);
                        }}
                    />
                )}
                onChange={(event, value) => {
                    value && isSymbol(value) && setSymbol(value as Symbol)
                }}
            />
        </Grid>
    </Grid>;
}

export default SymbolDetails;