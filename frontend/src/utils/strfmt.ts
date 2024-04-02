import { Item } from "../common/models/item";
import { Symbol } from "../common/models/symbol";

// Format a symbol or item for display
export function sfmt(s: Symbol | Item): string {
  let withSpaces = s.replace(/([a-z])([A-Z])/g, "$1 $2");

  if (withSpaces.endsWith("Essence")) {
    withSpaces = withSpaces.slice(0, -8);
  }

  return withSpaces;
}
