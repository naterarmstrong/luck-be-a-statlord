import { Box, Typography } from "@mui/material";
import { ArrowDirections, Symbol, SymbolUtils, isSymbol } from "../common/models/symbol";
import { SYMBOL_TO_IMG, getArrowImg } from "../utils/symbol";
import { Item } from "../common/models/item";
import { ITEM_TO_IMG, ItemDisabledIMG } from "../utils/item";
import React from "react";
import { Rarity, rarityColor } from "../common/models/rarity";
import { EarnedValue, SpinArrow, SpinItem, SpinSymbol, instanceOfSpinItem, instanceOfSpinSymbol } from "../common/models/run";

interface SymImgProps {
    tile: Symbol | Item | SpinSymbol | SpinItem,
    size?: number,
    earned?: EarnedValue,
    style?: React.CSSProperties,
}

const getImageSource = (tile: Symbol | Item): string => {
    if (isSymbol(tile)) {
        return SYMBOL_TO_IMG.get(tile as Symbol)!
    } else {
        return ITEM_TO_IMG.get(tile as Item)!
    }
}

const SymImg: React.FC<SymImgProps> = ({ tile, size, style, earned }) => {
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
    const coinsOverlayStyle = {
        top: .2 * pixelSize,
        left: 2 * pixelSize,
        color: rarityColor(Rarity.Rare),
        display: 'flex',
        alignItems: 'center',
        // flexWrap: 'wrap',
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
    const getCoinsOverlay = (earned: EarnedValue) => {
        if (!earned || earned.coins === 0) {
            return null;
        }
        return <Typography style={coinsOverlayStyle} zIndex={2} position="absolute" sx={{ fontSize: `${fSize * .8}px`, lineHeight: 1 }} >
            <SymImg tile={Symbol.Coin} style={{ marginRight: "5px" }} />
            {earned.coins}
        </Typography>
    }

    var countdown: number | undefined = undefined;
    var bonus: number | undefined = undefined;
    var multiplier: number | undefined = undefined;
    var disabled: boolean | undefined = undefined;
    var imgSrc: string;
    if (typeof tile === 'string') {
        imgSrc = getImageSource(tile);
    } else if (instanceOfSpinSymbol(tile)) {
        if (SymbolUtils.isArrow(tile.symbol)) {
            imgSrc = getArrowImg(tile.symbol, (tile as SpinArrow).direction);
        } else {
            imgSrc = getImageSource(tile.symbol);
        }
        countdown = tile.countdown;
        bonus = tile.bonus;
        multiplier = tile.multiplier;
    } else if (instanceOfSpinItem(tile)) {
        countdown = tile.countdown;
        disabled = tile.disabled;
        imgSrc = getImageSource(tile.item);
    } else {
        imgSrc = "NEVER"
    }

    if (countdown === undefined
        && bonus === undefined
        && multiplier === undefined
        && disabled === undefined
        && earned === undefined) {
        return <Box component="img" style={{ width: `${fSize}px`, ...style }} src={imgSrc} />;
    }

    return (
        <Box position="relative">
            <Box component="img" style={{ width: `${fSize}px`, ...style }} src={imgSrc} />
            {countdown !== undefined && getCountdownOverlay(countdown)}
            {bonus !== undefined && getBonusOverlay(bonus)}
            {multiplier !== undefined && getMultiplierOverlay(multiplier)}
            {disabled !== undefined && getDisabledOverlay(disabled)}
            {earned !== undefined && getCoinsOverlay(earned)}
        </Box>
    );
};

export default SymImg;