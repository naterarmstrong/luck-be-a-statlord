import { Box } from "@mui/material";
import { Symbol } from "../common/models/symbol";
import { SYMBOL_TO_IMG } from "../utils/symbol";

interface SymImgProps {
    symbol: Symbol,
    size?: number,
}

const SymImg: React.FC<SymImgProps> = ({ symbol, size }) => {
    return <Box component="img" style={{ width: size ?? "40px" }} src={SYMBOL_TO_IMG.get(symbol)} />
};

export default SymImg;