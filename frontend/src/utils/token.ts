import { Token } from "../common/models/token";

const removal_token = require("../img/removal_token.png");
const essence_token = require("../img/essence_token.png");
const reroll_token = require("../img/reroll_token.png");

export const TOKEN_TO_IMG: Record<Token, string> = {
  [Token.Removal]: removal_token,
  [Token.Reroll]: reroll_token,
  [Token.Essence]: essence_token,
};

export const TOKEN_COLOR: Record<Token, string> = {
  [Token.Removal]: "#6b6b6b",
  [Token.Reroll]: "#49aa10",
  [Token.Essence]: "#ff005d",
};
