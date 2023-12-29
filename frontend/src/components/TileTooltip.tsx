import { Divider, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from "@mui/material";
import { ITEM_RARITIES, Item } from "../common/models/item";
import { SYMBOL_RARITIES, Symbol, isSymbol } from "../common/models/symbol";
import React from "react";
import { SYMBOL_DESCRIPTIONS } from "../utils/symbolDescriptions";
import SymImg from "./SymImg";
import { Rarity, rarityColor } from "../common/models/rarity";

interface TileTooltipProps {
    tile: Symbol | Item,
    children: React.ReactElement<any, any>,
}

const tooltipBackColor = "#4a0a2b"
const tooltipEmphColor = "#961757";

const RedEmph = styled('span')(() => ({
    color: rarityColor(Rarity.Essence),
}));

const WhiteEmph = styled('span')(() => ({
    color: 'white',
}));

const getRarity = (tile: Symbol | Item): Rarity => {
    if (isSymbol(tile)) {
        return SYMBOL_RARITIES[tile as Symbol];
    } else {
        return ITEM_RARITIES[tile as Item];
    }
}


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: tooltipEmphColor,
        color: 'white',
        maxWidth: 450,
        fontSize: "40px",
        lineHeight: .7,
        border: '8px solid black',
        borderRadius: 0,
    },
}));

interface CoinValProps {
    coins: number
}

const CoinVal: React.FC<CoinValProps> = ({ coins }) => {
    const style = {
        color: rarityColor(Rarity.Rare),
    }
    return <Typography style={style} sx={{ fontSize: `40px`, lineHeight: .7 }} >
        <WhiteEmph>Gives </WhiteEmph> <SymImg tile={Symbol.Coin} size={30} omitTooltip textAlign style={{ marginRight: "-10px", marginLeft: "-5px" }} /> {coins}
    </Typography>
}

const TileTooltip: React.FC<TileTooltipProps> = ({ tile, children }) => {
    let description = "";
    if (isSymbol(tile)) {
        description = SYMBOL_DESCRIPTIONS[tile as Symbol];
    }

    const rarity = getRarity(tile);

    let descriptionElements = null;
    if (description) {
        descriptionElements = (
            <React.Fragment>
                <Divider variant="middle" style={{ marginTop: "15px", marginBottom: "10px", borderColor: "black", borderWidth: "2px" }} />
                {description}
            </React.Fragment>
        );
    }

    const title = (
        <React.Fragment>
            <Typography fontSize="50px" lineHeight={.7}> {tile} <SymImg tile={tile} omitTooltip textAlign /></Typography>
            {rarity !== Rarity.Special ?
                <Typography color={rarityColor(rarity)} fontSize="40px" lineHeight={.7}>
                    {rarity}
                </Typography> : null
            }
            <CoinVal coins={1} />
            {descriptionElements}
        </React.Fragment>
    )

    return (
        <HtmlTooltip
            title={title}>
            {children}
        </HtmlTooltip>);
}

export default TileTooltip;