export class SemanticVersion {
    major: number
    minor: number
    patch: number

    // Construct a version from the string representation
    constructor(version: string) {
        const splits = version.slice(1).split(".");
        this.major = Number(splits[0])
        this.minor = Number(splits[1])
        this.patch = Number(splits[2])

        if (isNaN(this.major) || isNaN(this.minor) || isNaN(this.patch)) {
            throw new Error("Version constructed with invalid string")
        }
    }

    // Returns true if this is at least as new as v
    newerThan(v: SemanticVersion) {
        if (this.major !== v.major) {
            return this.major > v.major;
        }
        if (this.minor !== v.minor) {
            return this.minor > v.minor;
        }
        return this.patch >= v.patch;
    }
}