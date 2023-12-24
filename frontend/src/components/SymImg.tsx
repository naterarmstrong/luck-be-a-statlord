import { Box, Typography } from "@mui/material";
import { ArrowDirections, Symbol, isSymbol } from "../common/models/symbol";
import { SYMBOL_TO_IMG } from "../utils/symbol";
import { Item } from "../common/models/item";
import { ITEM_TO_IMG, ItemDisabledIMG } from "../utils/item";
import React from "react";
import { Rarity, rarityColor } from "../common/models/rarity";
import { SpinItem, SpinSymbol, instanceOfSpinItem, instanceOfSpinSymbol } from "../common/models/run";

interface SymImgProps {
    tile: Symbol | Item | SpinSymbol | SpinItem,
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

const SymImg: React.FC<SymImgProps> = ({ tile, size, style }) => {
    const fSize = size ?? 40;
    const pixelSize = fSize / 12;
    const countdownOverlayStyle = {
        top: .5 * pixelSize,
        left: 1 * pixelSize,
        color: rarityColor(Rarity.Essence),
    };
    const bonusOverlayStyle = {
        bottom: 3.1 * pixelSize,
        left: 1 * pixelSize,
        color: rarityColor(Rarity.Rare),
    };
    const multiplierOverlayStyle = {
        top: .5 * pixelSize,
        right: 1 * pixelSize,
        color: rarityColor(Rarity.Rare),
    };
    const disabledOverlayStyle = {
        top: 2 * pixelSize,
        right: 3 * pixelSize,
        width: `${fSize * .7}px`
    };
    const fontSizeSx = {
        fontSize: `${fSize * .60}px`,
    };

    const getCountdownOverlay = (countdown: number) => {
        return <Typography style={countdownOverlayStyle} sx={fontSizeSx} zIndex={1} position="absolute" lineHeight="0px">
            {countdown}
        </Typography>
    };
    const getBonusOverlay = (bonus: number) => {
        return <Typography style={bonusOverlayStyle} sx={fontSizeSx} zIndex={1} position="absolute" lineHeight="0px">
            +{bonus}
        </Typography>
    }
    const getMultiplierOverlay = (multiplier: number) => {
        if (multiplier === 1) {
            return null;
        }
        return <Typography style={multiplierOverlayStyle} sx={fontSizeSx} zIndex={1} position="absolute" lineHeight="0px">
            {multiplier}x
        </Typography>
    }
    const getDisabledOverlay = (disabled: boolean) => {
        if (!disabled) {
            return null;
        }
        return <Box component="img" style={disabledOverlayStyle} src={ItemDisabledIMG} zIndex={1} position="absolute" />
    }

    var countdown: number | undefined = undefined;
    var bonus: number | undefined = undefined;
    var multiplier: number | undefined = undefined;
    var disabled: boolean | undefined = undefined;
    var imgSrc: string;
    if (typeof tile === 'string') {
        imgSrc = getImageSource(tile);
    } else if (instanceOfSpinSymbol(tile)) {
        countdown = tile.countdown;
        bonus = tile.bonus;
        multiplier = tile.multiplier;
        imgSrc = getImageSource(tile.symbol);
    } else if (instanceOfSpinItem(tile)) {
        countdown = tile.countdown;
        disabled = tile.disabled;
        imgSrc = getImageSource(tile.item);
    } else {
        imgSrc = "NEVER"
    }

    return (
        <Box position="relative">
            <Box component="img" style={{ width: `${fSize}px`, ...style }} src={imgSrc} />
            {countdown !== undefined && getCountdownOverlay(countdown)}
            {bonus !== undefined && getBonusOverlay(bonus)}
            {multiplier !== undefined && getMultiplierOverlay(multiplier)}
            {disabled !== undefined && getDisabledOverlay(disabled)}
        </Box>
    );
};

export default SymImg;