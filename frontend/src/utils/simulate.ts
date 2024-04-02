export const shuffle = (duplicates: number, count: number): Array<boolean> => {
  const a: Array<boolean> = [];
  for (let i = 0; i < duplicates; i++) {
    a.push(true);
  }
  for (let i = 0; i < count - duplicates; i++) {
    a.push(false);
  }

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }

  return a.slice(0, 20);
};

export const adjacentIdxs = (idx: number): Array<number> => {
  let adjacencies = [];
  const x = idx % 5;
  const y = Math.floor(idx / 5);
  for (let dx = -1; dx < 2; dx++) {
    for (let dy = -1; dy < 2; dy++) {
      let nx = x + dx;
      let ny = y + dy;
      if (nx >= 0 && nx < 5 && ny >= 0 && ny < 4) {
        adjacencies.push(ny * 5 + nx);
      }
    }
  }
  return adjacencies;
};

export const printBoard = (nums: Array<boolean>, success: boolean) => {
  const symbol = (s: boolean): string => {
    return s ? "X" : "O";
  };
  console.log(`Triggered: ${String(success)}`);
  let boardString = "";
  for (let y = 0; y < 4; y++) {
    let xs = [0, 1, 2, 3, 4];
    boardString += `    ${xs.map((x) => symbol(nums[5 * y + x])).join("")}\n`;
  }
  console.log(boardString);
};
