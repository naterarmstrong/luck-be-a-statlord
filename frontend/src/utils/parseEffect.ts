import { Item } from "../common/models/item";
import { LocatedSymbol } from "../common/models/run";
import { Symbol } from "../common/models/symbol";
import { IIDToSymbol } from "./symbol";

interface TransformationData {
  before: Symbol;
  after: Symbol;
}

export class Effect {
  source: Item | LocatedSymbol;
  effect: any;

  constructor(source: Item | LocatedSymbol, effect: any) {
    this.source = source;
    this.effect = effect;
  }

  isSymbolDestroyed(): boolean {
    return (
      this.effect.value_to_change === "destroyed" &&
      !(typeof this.source === "string")
    );
  }

  getSymbolDestroyed(): Symbol {
    return (this.source as LocatedSymbol).symbol;
  }

  // These get spit out in the logs anyways, no need to do anything
  isItemDestroyed(): boolean {
    return (
      this.effect.value_to_change === "destroyed" &&
      typeof this.source === "string"
    );
  }

  isSymbolRemoved(): boolean {
    return (
      this.effect.value_to_change === "removed" &&
      !(typeof this.source === "string")
    );
  }

  getSymbolRemoved(): Symbol {
    return (this.source as LocatedSymbol).symbol;
  }

  isSymbolTransformed(): boolean {
    return (
      this.effect.value_to_change === "type" &&
      !(typeof this.source === "string")
    );
  }

  getSymbolTransformed(): TransformationData {
    return {
      before: IIDToSymbol(this.effect.comparisons[0].b),
      after: (this.source as LocatedSymbol).symbol,
    };
  }

  equals(other: Effect): boolean {
    if (JSON.stringify(this) === JSON.stringify(other)) {
      return true;
    }
    if (
      this.source.toString() === other.source.toString() &&
      this.effect.value_to_change === "destroyed" &&
      other.effect.value_to_change === "destroyed"
    ) {
      return true;
    }
    return false;
  }
}
