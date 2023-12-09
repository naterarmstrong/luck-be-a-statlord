import { Autocomplete, Box, TextField } from "@mui/material";
import { SYMBOL_RARITIES, isSymbol, rarityColor } from "../common/models/symbol";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { Symbol } from "../common/models/symbol";

interface SymbolSelectorProps {
    symbol: Symbol,
    setSymbol: (s: Symbol) => void,
}

const SymbolSelector: React.FC<SymbolSelectorProps> = ({ symbol, setSymbol }) => {
    return <Autocomplete
        disablePortal
        autoComplete
        disableClearable
        options={Object.keys(Symbol)}
        value={symbol}
        renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 }, color: rarityColor(SYMBOL_RARITIES[option as Symbol]) }} {...props} >
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
}

export default SymbolSelector;