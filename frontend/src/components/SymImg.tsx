import { Box } from "@mui/material";
import { Symbol, isSymbol } from "../common/models/symbol";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { Item } from "../common/models/item";
import { ITEM_TO_IMG } from "../utils/item";
import React from "react";

interface SymImgProps {
    tile: Symbol | Item,
    size?: number,
    style?: React.CSSProperties,
}

const getImageSource = (tile: Symbol | Item): string => {
    if (isSymbol(tile)) {
        return SYMBOL_TO_IMG.get(tile as Symbol)!
    } else {
        return ITEM_TO_IMG.get(tile as Item)!
    }
}

const SymImg: React.FC<SymImgProps> = ({ tile: symbol, size, style }) => {
    return <Box component="img" style={{ width: size ?? "40px", ...style }} src={getImageSource(symbol)} />
};

export default SymImg;