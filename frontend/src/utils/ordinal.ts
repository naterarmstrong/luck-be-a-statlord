// Return an ordinalized string.
// i.e. 1 -> 1st, 2 -> 2nd, 11 -> 11th
export function ordinal(n: number): string {
  const ones = n % 10;
  const tens = Math.floor(n / 10) % 10;
  let suff = "";
  if (tens === 1) {
    suff = "th";
  } else {
    switch (ones) {
      case 1:
        suff = "st";
        break;
      case 2:
        suff = "nd";
        break;
      case 3:
        suff = "rd";
        break;
      default:
        suff = "th";
    }
  }

  return `${n}${suff}`;
}
