// The spin count on which, and the amount which is due on each rent payment. Note that this might

import { Item } from "../common/models/item";
import { RunDetails } from "../common/models/run";

// end up incorrect due to comfy pillow / comfy pillow essence / coffee cup / coffee cup essence.
export const RENT_F20_SPINS = new Map([
  [5, 25], // Rent 1
  [10, 50], // Rent 2
  [16, 100], // Rent 3
  [22, 150], // Rent 4
  [29, 225], // Rent 5
  [36, 300], // Rent 6
  [44, 375], // Rent 7
  [52, 450], // Rent 8
  [61, 600], // Rent 9
  [70, 650], // Rent 10
  [80, 700], // Rent 11
  [90, 777], // Rent 12
  [100, 1000], // Rent 13 - first landlord rent
  [110, 1500], // Rent 14 - second landlord rent
  [120, 2000], // Rent 15 - third landlord rent
]);

export const AVG_NECESSARY = [
  5, 10, 16.66, 25, 32.14, 42, 46.875, 56.25, 66.66, 72.22, 70, 77.7, 100, 150,
  200,
];
export const RENT_LENGTHS = [5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 10, 10];

export function getRentDue(spinIdx: number, details: RunDetails) {
  let effectiveSpinIdx = spinIdx;
  for (let i = 0; i < spinIdx; i++) {
    if (
      details.spins[spinIdx].itemsDestroyed.find(
        (i) => i === Item.Coffee || i === Item.CoffeeEssence,
      )
    ) {
      effectiveSpinIdx -= 1;
    }
  }

  let due = 0;
  let spinsRemaining = 0;
  for (const key of RENT_F20_SPINS.keys()) {
    if (effectiveSpinIdx < key) {
      due = RENT_F20_SPINS.get(key)!;
      spinsRemaining = key - effectiveSpinIdx - 1;
      break;
    }
  }

  return { due, spinsRemaining };
}
