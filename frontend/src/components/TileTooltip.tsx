import { Divider, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from "@mui/material";
import { ITEM_RARITIES, Item, isItem, itemToDisplay } from "../common/models/item";
import { SYMBOL_RARITIES, SYMBOL_VALUES, Symbol, SymbolUtils, isSymbol } from "../common/models/symbol";
import React from "react";
import { SYMBOL_DESCRIPTIONS } from "../utils/symbolDescriptions";
import SymImg from "./SymImg";
import { Rarity, rarityColor, rarityToString } from "../common/models/rarity";
import { IIDToSymbol } from "../utils/symbol";
import { GROUP_MEMBERS, Group, isGroup } from "../common/models/group";
import { ITEM_DESCRIPTIONS } from "../utils/itemDescriptions";
import { extractRemaining, extractToken, isToken, startsWithToken } from "../common/models/token";
import { TOKEN_COLOR } from "../utils/token";

interface TileTooltipProps {
    tile: Symbol | Item,
    children: React.ReactElement<any, any>,
}

const symbolLowColor = "#4a0a2b"
const symbolHighColor = "#961757";
const itemLowColor = "#0a4542"
const itemHighColor = "#077872";

const ColoredText = styled('span')(({ color }) => ({
    color: color,
}))

const getRarity = (tile: Symbol | Item): Rarity => {
    if (isSymbol(tile)) {
        return SYMBOL_RARITIES[tile as Symbol];
    } else {
        return ITEM_RARITIES[tile as Item];
    }
}

function getTitle(tile: Symbol | Item): string {
    if (isSymbol(tile)) {
        return SymbolUtils.symbolToDisplay(tile);
    } else if (isItem(tile)) {
        return itemToDisplay(tile);
    }
    return tile;
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
        maxWidth: 300,
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
        {omitGives ? null : <ColoredText color="white">Gives </ColoredText>} <SymImg tile={Symbol.Coin} size={30} omitTooltip textAlign style={{ marginRight: "-10px", marginLeft: "-5px" }} /> {coins}
    </Typography>
}


const TileTooltip: React.FC<TileTooltipProps> = ({ tile, children }) => {
    let description = "";
    if (isSymbol(tile)) {
        description = SYMBOL_DESCRIPTIONS[tile];
    } else if (isItem(tile)) {
        description = ITEM_DESCRIPTIONS[tile];
    }
    let value = undefined;
    if (isSymbol(tile)) {
        value = SYMBOL_VALUES[tile];
    }

    const rarity = getRarity(tile);

    let descriptionElements = null;
    if (description) {
        // Split the description by colons, which will pull out the relevant parts into their own strings
        const descSplit = description.split(":")
        // The pieces of the description, which are either text or a react element.
        const descPieces: Array<React.ReactElement<any, any>> = [];
        let lastWasStr = false;
        for (const piece of descSplit) {
            if (lastWasStr) {
                lastWasStr = false;
                // This is a group or coin or something
                if (piece.startsWith("coin") && piece.length !== 4) {
                    const numeric = Number(piece.slice(4));
                    if (isNaN(numeric)) {
                        throw new Error(`Broken description!! ${description}`)
                    }
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
                } else if (isToken(piece)) {
                    descPieces.push(<SymImg omitTooltip textAlign size={30} tile={piece} />);
                } else if (startsWithToken(piece)) {
                    const token = extractToken(piece);
                    const numeric = Number(extractRemaining(piece));
                    if (isNaN(numeric)) {
                        throw new Error(`Broken description!! ${description}`)
                    }
                    descPieces.push(<SymImg omitTooltip textAlign size={30} tile={token} />);
                    descPieces.push(<ColoredText color={TOKEN_COLOR[token]}>{numeric}</ColoredText>);
                } else {
                    descPieces.push(<React.Fragment>{piece}</React.Fragment>);
                }

            } else {
                lastWasStr = true;
                // This is just a string part. We need to split apart and look for sections to highlight.
                descPieces.push(processDescriptionText(piece));
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
            <Typography fontSize="50px" lineHeight={.7}> {getTitle(tile)} <SymImg tile={tile} omitTooltip textAlign /></Typography>
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

// Iteratively pass through a series of words, and change the text color for certain words to the
// essence highlight color.
function processDescriptionText(text: string): React.ReactElement<any, any> {
    const retSoFar = [];
    // Build up the string of non-highlighted words so that they can be together
    let currentStr = "";
    for (const word of text.split(" ")) {
        // Process pairs of words to capture 'Very Rare' and 'each other'
        if (currentStr.endsWith("Very ") && word === "Rare") {
            const prevCurrStr = currentStr.slice(0, -5);
            if (prevCurrStr !== "") {
                retSoFar.push(<React.Fragment>{prevCurrStr}</React.Fragment>);
            }
            currentStr = "";

            retSoFar.push(<React.Fragment><ColoredText color={rarityColor(Rarity.VeryRare)}>{"Very Rare "}</ColoredText></React.Fragment>);
            continue;
        } else if (currentStr.endsWith("each ") && word === "other") {
            const prevCurrStr = currentStr.slice(0, -5);
            if (prevCurrStr !== "") {
                retSoFar.push(<React.Fragment>{prevCurrStr}</React.Fragment>);
            }
            currentStr = "";

            retSoFar.push(<React.Fragment><ColoredText color={rarityColor(Rarity.Essence)}>{"each other "}</ColoredText></React.Fragment>);
            continue;
        }

        const lowered = word.toLowerCase();
        const needsHighlight = (
            lowered.startsWith("destroy")
            || lowered.startsWith("transform")
            || lowered.startsWith("remove")
            || (lowered.startsWith("add") && lowered.length < 7)
            || lowered === "grow"
            || !isNaN(Number(lowered))
            || lowered === "times"
            || (!isNaN(Number(lowered.slice(0, -1))) && ["x", "%"].includes(lowered.slice(-1)))
            || isStringRarity(word));
        if (needsHighlight) {
            if (currentStr !== "") {
                retSoFar.push(<React.Fragment>{currentStr}</React.Fragment>);
                currentStr = "";
            }
            let color = rarityColor(Rarity.Essence);
            if (isStringRarity(word)) {
                color = rarityColor(getRarityFromString(word));
            }
            retSoFar.push(<React.Fragment><ColoredText color={color}>{word + " "}</ColoredText></React.Fragment>);
        } else {
            currentStr = currentStr + word + " "
        }
    }

    if (currentStr !== "") {
        retSoFar.push(<React.Fragment>{currentStr}</React.Fragment>);
    }

    return <React.Fragment>{retSoFar}</React.Fragment>;
}

function isStringRarity(word: string): boolean {
    return ["Common", "Uncommon", "Rare", "Special", "Essence"].includes(word);
}

function getRarityFromString(word: string): Rarity {
    switch (word) {
        case "Common":
            return Rarity.Common;
        case "Uncommon":
            return Rarity.Uncommon;
        case "Rare":
            return Rarity.Rare;
        case "Special":
            return Rarity.Special;
        case "Essence":
            return Rarity.Essence;
    }
    throw new Error("Got rarity when the string was not a rarity");
}

export default TileTooltip;