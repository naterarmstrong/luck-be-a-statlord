import { Divider, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from "@mui/material";
import { ITEM_RARITIES, Item } from "../common/models/item";
import { SYMBOL_RARITIES, SYMBOL_VALUES, Symbol, isSymbol } from "../common/models/symbol";
import React from "react";
import { SYMBOL_DESCRIPTIONS } from "../utils/symbolDescriptions";
import SymImg from "./SymImg";
import { Rarity, rarityColor, rarityToString } from "../common/models/rarity";
import { IIDToSymbol } from "../utils/symbol";
import { GROUP_MEMBERS, Group, isGroup } from "../common/models/group";

interface TileTooltipProps {
    tile: Symbol | Item,
    children: React.ReactElement<any, any>,
}

const symbolLowColor = "#4a0a2b"
const symbolHighColor = "#961757";
const itemLowColor = "#0a4542"
const itemHighColor = "#077872";

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

interface StyledTooltipProps extends TooltipProps {
    item: boolean,
}


const StyledTooltip = styled(({ item, className, ...props }: StyledTooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ item, theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: item ? itemHighColor : symbolHighColor,
        color: 'white',
        maxWidth: 320,
        fontSize: "40px",
        lineHeight: .7,
        border: '6px solid black',
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
    let value = undefined;
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
                } else if (piece === "this") {
                    descPieces.push(<SymImg omitTooltip textAlign size={30} tile={tile as Symbol} />);
                } else if (IIDToSymbol(piece) !== Symbol.Unknown) {
                    descPieces.push(<SymImg omitTooltip textAlign size={30} tile={IIDToSymbol(piece)} />);
                } else if (isGroup(piece)) {
                    const symbols = GROUP_MEMBERS[piece as Group];
                    const symElements = symbols.map((s) => <SymImg omitTooltip textAlign size={30} tile={s} style={{ marginLeft: .3, marginRight: .3 }} />);
                    if (symElements.length > 1) {
                        const lastElement = symElements.pop()!;
                        symElements.push(<React.Fragment> or </React.Fragment>)
                        symElements.push(lastElement);
                    }
                    descPieces.push(<React.Fragment>{symElements}</React.Fragment>)
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
                    {rarityToString(rarity)}
                </Typography> : null
            }
            {value !== undefined ? <CoinVal coins={value} /> : null}
            {descriptionElements}
        </React.Fragment>
    )

    return (
        <StyledTooltip
            title={title}
            item={!isSymbol(tile)}
        >
            {children}
        </StyledTooltip>);
}

export default TileTooltip;