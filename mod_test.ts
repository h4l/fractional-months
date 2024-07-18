import { date } from "./_testing.ts";
import { assertEquals } from "./dev_deps.ts";
import { differenceUtc, monthDifferenceUtc } from "./mod.ts";

// Mostly tested in _datetime_test.ts; this is just to verify mod.ts exports.
Deno.test("differenceUtc", () => {
  assertEquals(
    differenceUtc(date("2024-01-01"), date("2024-02-01"), "months"),
    1,
  );
});

Deno.test("differenceUtc", () => {
  assertEquals(
    monthDifferenceUtc(date("2024-01-01"), date("2024-02-01")),
    1,
  );
});
