import { Tooltip, TooltipProps, Typography, styled, tooltipClasses } from "@mui/material";
import { Item } from "../common/models/item";
import { Symbol, isSymbol } from "../common/models/symbol";
import React from "react";
import { SYMBOL_DESCRIPTIONS } from "../utils/symbolDescriptions";

interface TileTooltipProps {
    tile: Symbol | Item,
    children: React.ReactElement<any, any>,
}

const tooltipColor = "#4a0a2b"


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: tooltipColor,
        color: 'white',
        maxWidth: 300,
        fontSize: "30px",
        border: '4px solid black',
        borderRadius: 0,
    },
}));

const TileTooltip: React.FC<TileTooltipProps> = ({ tile, children }) => {
    let description = "";
    if (isSymbol(tile)) {
        description = SYMBOL_DESCRIPTIONS[tile as Symbol];
    }

    const title = (
        <React.Fragment>
            <Typography> {tile} </Typography>
            {description}
        </React.Fragment>
    )

    return (
        <HtmlTooltip
            title={title}>
            {children}
        </HtmlTooltip>);
}

export default TileTooltip;