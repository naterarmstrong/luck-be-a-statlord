import React from "react";
import GameBoard from "../components/GameBoard";
import { Symbol } from "../common/models/symbol";
import { SpinSymbol } from "../common/models/run";

const RunDisplay: React.FC = () => {
    const testSymbols = [Symbol.Sun, Symbol.FiveSidedDie, Symbol.RabbitFluff, Symbol.Flower, Symbol.Rain];
    testSymbols.push(...[Symbol.ShinyPebble, Symbol.Dud, Symbol.RabbitFluff, Symbol.Flower, Symbol.Rain]);
    testSymbols.push(...[Symbol.Sun, Symbol.Rabbit, Symbol.RabbitFluff, Symbol.Flower, Symbol.Rain])
    testSymbols.push(...[Symbol.Sun, Symbol.FiveSidedDie, Symbol.RabbitFluff, Symbol.Flower, Symbol.Rain])

    const testSpinSymbols: Array<SpinSymbol> = testSymbols.map((s) => { return { symbol: s } });
    testSpinSymbols[6].countdown = 23;
    testSpinSymbols[8].bonus = 1;
    testSpinSymbols[10].multiplier = 3;

    return (
        <GameBoard symbols={testSpinSymbols} />
    );
}

export default RunDisplay;