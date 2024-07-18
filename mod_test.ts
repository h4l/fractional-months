import { date } from "./_testing.ts";
import { assert, assertEquals } from "./dev_deps.ts";
import { differenceUtc, monthDifferenceUtc, type Unit } from "./mod.ts";

// Mostly tested in _datetime_test.ts; this is just to verify mod.ts exports.
Deno.test("differenceUtc", () => {
  const unit: Unit = "months";
  assertEquals(
    differenceUtc(date("2024-01-01"), date("2024-02-01"), unit),
    1,
  );
});

Deno.test("Module docs: intro", () => {
  const jan10 = new Date("2024-01-10T12:00:00.000Z");
  const feb10 = new Date("2024-02-10T12:00:00.000Z");

  assert(monthDifferenceUtc(jan10, feb10) === 1);
  assert(monthDifferenceUtc(feb10, jan10) === -1);

  // 1ms after is strictly greater than (but very close to) 1
  const msAfterFeb10 = new Date(feb10.getTime() + 1);
  assert(monthDifferenceUtc(jan10, msAfterFeb10) > 1);
  assert(monthDifferenceUtc(jan10, msAfterFeb10) < 1.000000001);

  // 1ms before is strictly less than (but very close to) 1
  const msBeforeFeb10 = new Date(feb10.getTime() - 1);
  assert(monthDifferenceUtc(jan10, msBeforeFeb10) < 1);
  assert(monthDifferenceUtc(jan10, msBeforeFeb10) > 0.999999999);
});

Deno.test("Module docs: End of January to end of February/start of March", () => {
  const jan30 = new Date("2024-01-30T12:34:56Z");
  const endOfFeb = new Date("2024-02-29T23:59:59.999Z");
  const startOfMarch = new Date("2024-03-01T00:00:00Z");

  // 1 month not passed yet
  assert(monthDifferenceUtc(jan30, endOfFeb) > 0.999999999);
  assert(monthDifferenceUtc(jan30, endOfFeb) < 1);

  // 1 month has passed — beyond exactly -1
  assert(monthDifferenceUtc(jan30, startOfMarch) > 1);
  assert(monthDifferenceUtc(jan30, startOfMarch) < 1.000000001);
});

Deno.test("Module docs: End of March to end of February/start of March", () => {
  const march31 = new Date("2024-03-31T12:34:56Z");
  const endOfFeb = new Date("2024-02-29T23:59:59.999Z");
  const startOfMarch = new Date("2024-03-01T00:00:00Z");

  // -1 month not passed yet
  assert(monthDifferenceUtc(march31, startOfMarch) < -0.999999999);
  assert(monthDifferenceUtc(march31, startOfMarch) > -1);

  // -1 month has passed — beyond exactly 1
  assert(monthDifferenceUtc(march31, endOfFeb) < -1);
  assert(monthDifferenceUtc(march31, endOfFeb) > -1.000000001);
});
