/** Parse an iso date and return it as a ms timestamp, throw on invalid syntax. */
export function timestamp(isoDate: string): number {
  const timestamp = Date.parse(isoDate);
  if (Number.isNaN(timestamp)) throw new Error("Invalid date");
  return timestamp;
}

/** Parse an iso date and return it as a Date, throw on invalid syntax. */
export function date(isoDate: string, offset: number = 0): Date {
  return new Date(timestamp(isoDate) + offset);
}
