import { Divider, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from "@mui/material";
import { ITEM_RARITIES, Item } from "../common/models/item";
import { SYMBOL_RARITIES, SYMBOL_VALUES, Symbol, isSymbol } from "../common/models/symbol";
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
    coins: number,
    omitGives?: boolean,
}

const CoinVal: React.FC<CoinValProps> = ({ coins, omitGives }) => {
    return <Typography style={{ color: rarityColor(Rarity.Rare) }} sx={{ fontSize: `40px`, lineHeight: .7 }} display="inline">
        {omitGives ? null : <WhiteEmph>Gives </WhiteEmph>} <SymImg tile={Symbol.Coin} size={30} omitTooltip textAlign style={{ marginRight: "-10px", marginLeft: "-5px" }} /> {coins}
    </Typography>
}

const TileTooltip: React.FC<TileTooltipProps> = ({ tile, children }) => {
    let description = "";
    if (isSymbol(tile)) {
        description = SYMBOL_DESCRIPTIONS[tile as Symbol];
    }
    let value = 0;
    if (isSymbol(tile)) {
        value = SYMBOL_VALUES[tile as Symbol];
    }

    const rarity = getRarity(tile);

    let descriptionElements = null;
    if (description) {
        // Split the description by colons, which will pull out the relevant parts into their own strings
        const descSplit = description.split(":")
        // The pieces of the description, which are either text or a react element.
        const descPieces: Array<React.ReactElement<any, any>> = [];
        let lastWasStr = false;
        console.log("Parsing description", description)
        for (const piece of descSplit) {
            if (lastWasStr) {
                lastWasStr = false;
                // This is a group or coin or something
                console.log("Piece", piece, piece.startsWith("coin"), piece.length)
                if (piece.startsWith("coin") && piece.length !== 4) {
                    const numeric = Number(piece.slice(4));
                    if (isNaN(numeric)) {
                        throw new Error(`Broken description!! ${description}`)
                    }
                    console.log("Pushing coin value", numeric)
                    descPieces.push(<CoinVal coins={numeric} omitGives />);
                } else {
                    console.log("Pushing piece", piece)
                    descPieces.push(<React.Fragment>{piece}</React.Fragment>);
                }

            } else {
                // This is just a string part
                lastWasStr = true;
                console.log("Pushing string part", piece)
                descPieces.push(<React.Fragment>{piece}</React.Fragment>);
            }
        }

        descriptionElements = (
            <React.Fragment>
                <Divider variant="middle" style={{ marginTop: "15px", marginBottom: "10px", borderColor: "black", borderWidth: "2px" }} />
                <Typography fontSize="40px" lineHeight={.7} >
                    {descPieces}
                </Typography>
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
            <CoinVal coins={value} />
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