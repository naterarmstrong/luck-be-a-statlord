import { Autocomplete, Box, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import { Symbol, isSymbol } from "../common/models/symbol";
import { useEffect, useState } from "react";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { useSearchParams } from "react-router-dom";
import SymbolSelector from "../components/SymbolSelector";
import SymImg from "../components/SymImg";

export interface PairPerformance {
    WinRateTogether: number,
    WinRateSymbol1: number,
    WinRateSymbol2: number,
    GamesTogether: number,
    GamesApartSymbol1: number,
    GamesApartSymbol2: number,
}

const SymbolDetails: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    let startSymbol = Symbol.Unknown;
    if (searchParams.get("symbol") !== null && isSymbol(searchParams.get("symbol") as any)) {
        startSymbol = searchParams.get("symbol") as Symbol;
    }
    const [symbol, setSymbol] = useState<Symbol>(startSymbol);
    const [secondarySymbol, setSecondarySymbol] = useState<Symbol>(Symbol.Unknown);
    const [pairPerf, setPairPerf] = useState<PairPerformance | null>(null);

    useEffect(() => {
        setSearchParams({ symbol: symbol });
    }, [symbol])


    useEffect(() => {
        if (symbol === Symbol.Unknown || secondarySymbol === Symbol.Unknown) {
            return
        }

        const fetchSymbolStats = async () => {
            const response = await fetch(`http://localhost:3001/symbol/${symbol}/with/${secondarySymbol}`);
            if (!response.ok) {
                console.log(`Error fetching symbol stats`);
            }
            const jsonData = await response.json();
            setPairPerf(jsonData);
        }

        fetchSymbolStats().catch(console.error);
    }, [symbol, secondarySymbol])

    return <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={4}>
            <Typography variant="h4">
                Symbol Details
            </Typography>
        </Grid>
        <Grid item xs={8}>
            <SymbolSelector symbol={symbol} setSymbol={setSymbol} />
        </Grid>
        <Grid item xs={4}>
            <Typography variant="h3">
                <Box component="img" style={{ width: "80px", marginRight: 20 }} src={SYMBOL_TO_IMG.get(symbol)} />
                {symbol}
            </Typography>
        </Grid>
        <Grid item xs={8}>
            <Grid container>
                <Grid item xs={4}>
                    <Typography variant="h6">
                        With other symbols:
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <SymbolSelector symbol={secondarySymbol} setSymbol={setSecondarySymbol} />
                </Grid>
                {pairPerf !== null ?
                    <Grid item xs={12}>
                        <SymImg symbol={symbol} /> <SymImg symbol={secondarySymbol} />: {pairPerf.WinRateTogether}% win rate. {pairPerf.GamesTogether} Games. <br />
                        <SymImg symbol={symbol} /> <SymImg symbol={Symbol.Dud} />: {pairPerf.WinRateSymbol1}% win rate. {pairPerf.GamesApartSymbol1} Games. <br />
                        <SymImg symbol={Symbol.Dud} /> <SymImg symbol={secondarySymbol} />: {pairPerf.WinRateSymbol2}% win rate. {pairPerf.GamesApartSymbol2} Games. <br />
                    </Grid> : null}
            </Grid>
        </Grid>
    </Grid>;
}

export default SymbolDetails;