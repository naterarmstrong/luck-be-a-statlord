export function msToTime(ms: number): string {
  let seconds = (ms / 1000).toFixed(2);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (Number(seconds) < 60) return seconds + " Sec";
  else if (Number(minutes) < 60) return minutes + " Min";
  else if (Number(hours) < 24) return hours + " Hrs";
  else return days + " Days";
}
