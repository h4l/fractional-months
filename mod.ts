/**
 * Calculate the difference between points in time as fractional time or month
 * units.
 *
 * This module provides similar functionality to
 * [@std/datetime's `difference()`](https://jsr.io/@std/datetime/doc/~/difference)
 * function. That returns rounded integers, whereas this module returns
 * fractional values that you can choose how to round.
 *
 * Fractional months simplify month-difference calculations by abstracting the
 * difference in length between months. Month-difference values are negative or
 * positive floating-point values:
 *
 * - Differences of exact multiples of 1 month are always exact integers
 * - Differences of more or less than 1-month multiples are fractional values,
 *   like 1.5 or -1.7
 * - Values are negative when the to-date is earlier than the from-date.
 * - Non-integer fractional values represent the position of the to-date,
 *   relative to month boundaries before and after the to-date.
 *   - Boundaries are at the day/time of the from-date in each month.
 * - Month boundaries that occur on calendar days that don't exist in all months
 *   are handled as if the days existed with 0-length — "imaginary days".
 *
 * ```typescript
 * import { assert } from "jsr:@std/assert/";
 * import { monthDifferenceUtc } from "jsr:@h4l/fractional-months"
 *
 * const jan10 = new Date("2024-01-10T12:00:00.000Z");
 * const feb10 = new Date("2024-02-10T12:00:00.000Z");
 *
 * assert(monthDifferenceUtc(jan10, feb10) === 1);
 * assert(monthDifferenceUtc(feb10, jan10) === -1);
 *
 * // 1ms after is strictly greater than (but very close to) 1
 * const msAfterFeb10 = new Date(feb10.getTime() + 1);
 * assert(monthDifferenceUtc(jan10, msAfterFeb10) > 1);
 * assert(monthDifferenceUtc(jan10, msAfterFeb10) < 1.000000001);
 *
 * // 1ms before is strictly less than (but very close to) 1
 * const msBeforeFeb10 = new Date(feb10.getTime() - 1);
 * assert(monthDifferenceUtc(jan10, msBeforeFeb10) < 1);
 * assert(monthDifferenceUtc(jan10, msBeforeFeb10) > 0.999999999);
 * ```
 *
 * Compared to integers, they have the advantage that you can choose how to
 * round. For example, by rounding to -Inf you can bucket timestamps into unique
 * month-long integer indexes.
 *
 * They make it easy to answer questions like "Have 3 months passed from date X
 * to now?" or "How far through the month is this?".
 *
 * ## Imaginary days
 *
 * The difficult thing about months is of course that they have varying lengths!
 * So fractions of months must be considered relative measures — half of one
 * month plus half of another month does not necessarily equal 1 of another
 * month.
 *
 * This module deals with varying-length months by treating months with less
 * than 31 days as if the missing days existed, but take up 0 time.
 *
 * ### Example: End of January to end of February/start of March
 *
 * From 2024-01-31 counting forward, 2024-01-29 is the last day
 * before 2024-03-01. Clearly a month has not passed by the end of 2024-02-29,
 * but has by 2024-03-01.
 *
 * ```
 *                                       Imaginary 0-length days
 *                                                              ╲
 * ╭─────── January 2024 ───────╮ ╭────── February 2024 ──────╮ ╭╮ ╭─ March 2024
 * .............................. ............................. .. .............
 * 0        1         2         3 0        1         2        2 33 0        1
 * 1        0         0         1 1        0         0        9 01 1        0
 *                              │                               │
 *                              ╰────→────→────→────→────→────→─╯
 *                              Jan 30 + 1 month = Feb "30"
 *                              • Anywhere in Feb is < 1 month
 *                              • Anywhere in March is > 1 month
 *                              • No point is exactly 1 month
 * ```
 *
 * So in practice:
 *
 * ```typescript
 * const jan30 = new Date("2024-01-30T12:34:56Z");
 * const endOfFeb = new Date("2024-02-29T23:59:59.999Z");
 * const startOfMarch = new Date("2024-03-01T00:00:00Z");
 *
 * // 1 month not passed yet
 * assert(monthDifferenceUtc(jan30, endOfFeb) > 0.999999999);
 * assert(monthDifferenceUtc(jan30, endOfFeb) < 1);
 *
 * // over 1 month — greater than exactly 1
 * assert(monthDifferenceUtc(jan30, startOfMarch) > 1);
 * assert(monthDifferenceUtc(jan30, startOfMarch) < 1.000000001);
 * ```
 *
 * ### Example: End of March to end of February/start of March
 *
 * Counting back from 2024-03-31, logically, 2024-03-01 is less than a whole
 * month before. But 2024-02-29 is more than a full month before.
 *
 * ```
 *                                 Imaginary 0-length days
 *                                ╱
 * ╭────── February 2024 ──────╮ ╭╮ ╭───────── March 2024 ────────╮
 * ............................. .. ...............................
 * 0        1         2        2 33 0        1         2         33
 * 1        0         0        9 01 1        0         0         01
 *                                │                               │
 *                                ╰←────←────←────←────←────←────←╯
 *                                 March 31 - 1 month = Feb "31"
 *                                 • Anywhere in Feb is < -1 month
 *                                 • Anywhere in March is > -1 month
 *                                 • No point is exactly -1 month
 * ```
 *
 * So in practice:
 *
 * ```typescript
 * const march31 = new Date("2024-03-31T12:34:56Z");
 * const endOfFeb = new Date("2024-02-29T23:59:59.999Z");
 * const startOfMarch = new Date("2024-03-01T00:00:00Z");
 *
 * // -1 month not passed yet
 * assert(monthDifferenceUtc(march31, startOfMarch) < -0.999999999);
 * assert(monthDifferenceUtc(march31, startOfMarch) > -1);
 *
 * // -1 month has passed — beyond exactly -1
 * assert(monthDifferenceUtc(march31, endOfFeb) < -1);
 * assert(monthDifferenceUtc(march31, endOfFeb) > -1.000000001);
 * ```
 *
 * ## APIs
 *
 * As well as {@link monthDifferenceUtc} which just calculates 1-month-unit
 * differences, there's also {@link differenceUtc}, which calculates time in
 * various time units, similar to [@std/datetime difference](https://jsr.io/@std/datetime/doc/~/difference).
 *
 * @module
 */
export { differenceUtc, monthDifferenceUtc, type Unit } from "./_datetime.ts";
