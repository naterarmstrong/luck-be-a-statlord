export class SemanticVersion {
  major: number;
  minor: number;
  patch: number;

  // Construct a version from the string representation
  constructor(version: string) {
    const splits = version.slice(1).split(".");
    if (splits[0].startsWith("v")) {
      this.major = Number(splits[0].slice(1));
    } else {
      this.major = Number(splits[0]);
    }
    this.minor = Number(splits[1]);
    this.patch = Number(splits[2]);

    // We allow the patch to be NaN. If we run into issues in the future, we can fix this
    if (isNaN(this.major) || isNaN(this.minor)) {
      throw new Error("Version constructed with invalid string");
    }
  }

  // Returns true if this is at least as new as v
  newerThan(v: SemanticVersion | string) {
    if (typeof v === "string") {
      v = new SemanticVersion(v);
    }

    if (this.major !== v.major) {
      return this.major >= v.major;
    }
    if (this.minor !== v.minor) {
      return this.minor >= v.minor;
    }
    return this.patch >= v.patch;
  }
}
