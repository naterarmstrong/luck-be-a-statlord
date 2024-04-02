import { Box, Typography } from "@mui/material";
import { Symbol, SymbolUtils, isSymbol } from "../common/models/symbol";
import { SYMBOL_TO_IMG, getArrowImg } from "../utils/symbol";
import { Item } from "../common/models/item";
import { ITEM_TO_IMG, ItemDisabledIMG } from "../utils/item";
import React from "react";
import { Rarity, rarityColor } from "../common/models/rarity";
import {
  EarnedValue,
  SpinArrow,
  SpinItem,
  SpinSymbol,
  instanceOfSpinItem,
  instanceOfSpinSymbol,
} from "../common/models/run";
import TileTooltip from "./TileTooltip";
import { Token, isToken } from "../common/models/token";
import { TOKEN_TO_IMG } from "../utils/token";

interface SymImgProps {
  tile: Symbol | Item | Token | SpinSymbol | SpinItem;
  size?: number;
  earned?: EarnedValue;
  style?: React.CSSProperties;
  omitTooltip?: boolean;
  // Whether or not to set the bottom margin to a negative value, so as to align better with text
  textAlign?: boolean;
}

const getImageSource = (tile: Symbol | Item | Token): string => {
  if (isSymbol(tile)) {
    return SYMBOL_TO_IMG.get(tile as Symbol)!;
  } else if (isToken(tile)) {
    return TOKEN_TO_IMG[tile];
  } else {
    return ITEM_TO_IMG.get(tile as Item)!;
  }
};

const SymImg: React.FC<SymImgProps> = ({
  tile,
  size,
  style,
  earned,
  omitTooltip,
  textAlign,
}) => {
  const fSize = size ?? 40;
  const pixelSize = fSize / 12;
  const countdownOverlayStyle = {
    top: 0.5 * pixelSize,
    left: 1 * pixelSize,
    color: rarityColor(Rarity.Essence),
  };
  const bonusOverlayStyle = {
    bottom: 3.1 * pixelSize,
    left: 1 * pixelSize,
    color: rarityColor(Rarity.Rare),
  };
  const multiplierOverlayStyle = {
    top: 0.5 * pixelSize,
    right: 1 * pixelSize,
    color: rarityColor(Rarity.Rare),
  };
  const disabledOverlayStyle = {
    top: 2 * pixelSize,
    right: 3 * pixelSize,
    width: `${fSize * 0.7}px`,
  };
  const coinsOverlayStyle = {
    top: 0.2 * pixelSize,
    left: 2 * pixelSize,
    color: rarityColor(Rarity.Rare),
    display: "flex",
    alignItems: "center",
    // flexWrap: 'wrap',
  };
  const fontSizeSx = {
    fontSize: `${fSize * 0.6}px`,
  };

  const getCountdownOverlay = (countdown: number) => {
    return (
      <Typography
        style={countdownOverlayStyle}
        sx={fontSizeSx}
        zIndex={1}
        position="absolute"
        lineHeight="0px"
      >
        {countdown}
      </Typography>
    );
  };
  const getBonusOverlay = (bonus: number) => {
    return (
      <Typography
        style={bonusOverlayStyle}
        sx={fontSizeSx}
        zIndex={1}
        position="absolute"
        lineHeight="0px"
      >
        +{bonus}
      </Typography>
    );
  };
  const getMultiplierOverlay = (multiplier: number) => {
    if (multiplier === 1) {
      return null;
    }
    return (
      <Typography
        style={multiplierOverlayStyle}
        sx={fontSizeSx}
        zIndex={1}
        position="absolute"
        lineHeight="0px"
      >
        {multiplier}x
      </Typography>
    );
  };
  const getDisabledOverlay = (disabled: boolean) => {
    if (!disabled) {
      return null;
    }
    return (
      <Box
        component="img"
        style={disabledOverlayStyle}
        src={ItemDisabledIMG}
        zIndex={1}
        position="absolute"
      />
    );
  };
  const getCoinsOverlay = (earned: EarnedValue) => {
    if (!earned || earned.coins === 0) {
      return null;
    }
    return (
      <Typography
        style={coinsOverlayStyle}
        zIndex={2}
        position="absolute"
        sx={{ fontSize: `${fSize * 0.8}px`, lineHeight: 1 }}
      >
        <SymImg tile={Symbol.Coin} omitTooltip style={{ marginRight: "5px" }} />
        {earned.coins}
      </Typography>
    );
  };

  var countdown: number | undefined = undefined;
  var bonus: number | undefined = undefined;
  var multiplier: number | undefined = undefined;
  var disabled: boolean | undefined = undefined;
  var imgSrc: string;
  var enumVal: Symbol | Item | Token;
  if (typeof tile === "string") {
    imgSrc = getImageSource(tile);
    enumVal = tile;
  } else if (instanceOfSpinSymbol(tile)) {
    if (SymbolUtils.isArrow(tile.symbol)) {
      imgSrc = getArrowImg(tile.symbol, (tile as SpinArrow).direction);
    } else {
      imgSrc = getImageSource(tile.symbol);
    }
    enumVal = tile.symbol;
    countdown = tile.countdown;
    bonus = tile.bonus;
    multiplier = tile.multiplier;
  } else if (instanceOfSpinItem(tile)) {
    enumVal = tile.item;
    countdown = tile.countdown;
    disabled = tile.disabled;
    imgSrc = getImageSource(tile.item);
  } else {
    imgSrc = "NEVER";
    enumVal = Item.ItemMissing;
  }

  let srcStyle = {
    width: `${fSize}px`,
    ...(textAlign && { marginBottom: `-${fSize / 4}px` }),
    ...style,
  };

  let baseReturn;
  if (
    countdown === undefined &&
    bonus === undefined &&
    multiplier === undefined &&
    disabled === undefined &&
    earned === undefined
  ) {
    baseReturn = <Box component="img" style={srcStyle} src={imgSrc} />;
  } else {
    baseReturn = (
      <Box position="relative">
        <Box component="img" style={srcStyle} src={imgSrc} />
        {countdown !== undefined && getCountdownOverlay(countdown)}
        {bonus !== undefined && getBonusOverlay(bonus)}
        {multiplier !== undefined && getMultiplierOverlay(multiplier)}
        {disabled !== undefined && getDisabledOverlay(disabled)}
        {earned !== undefined && getCoinsOverlay(earned)}
      </Box>
    );
  }

  if (omitTooltip || isToken(enumVal)) {
    return baseReturn;
  } else {
    return <TileTooltip tile={enumVal}>{baseReturn}</TileTooltip>;
  }
};

export default SymImg;
