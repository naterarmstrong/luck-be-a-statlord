import { Item } from "../common/models/item";
import { Symbol } from "../common/models/symbol";

// Format a symbol or item for display
export function sfmt(s: Symbol | Item): string {
    const withSpaces = s.replace(/([a-z])([A-Z])/g, '$1 $2')

    return withSpaces
}
