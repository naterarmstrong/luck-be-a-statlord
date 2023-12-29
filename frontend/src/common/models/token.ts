export enum Token {
    Removal = "removal",
    Reroll = "reroll",
    Essence = "essence"
}

export function isToken(s: string): s is Token {
    return Object.values(Token).includes(s as any);
}

export function startsWithToken(s: string): boolean {
    return ((s.startsWith("removal") && s !== "removal")
        || (s.startsWith("reroll") && s !== "reroll")
        || (s.startsWith("essence") && s !== "essence"))
}

export function extractToken(s: string): Token {
    if (s.startsWith("removal")) {
        return Token.Removal;
    } else if (s.startsWith("reroll")) {
        return Token.Reroll;
    } else if (s.startsWith("essence")) {
        return Token.Essence;
    }
    throw new Error("No token to extract");
}

export function extractRemaining(s: string): string {
    if (s.startsWith("removal")) {
        return s.slice(7);
    } else if (s.startsWith("reroll")) {
        return s.slice(6);
    } else if (s.startsWith("essence")) {
        return s.slice(7);
    }
    return s;
}