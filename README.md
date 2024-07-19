# fractional-months

[![JSR](https://jsr.io/badges/@h4l/fractional-months)](https://jsr.io/@h4l/fractional-months)
[![JSR Score](https://jsr.io/badges/@h4l/fractional-months/score)](https://jsr.io/@h4l/fractional-months/score)
[![main branch CI status](https://github.com/h4l/fractional-months/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/h4l/fractional-months/actions)

A small typescript library to calculate the difference between points in time as
fractional months.

Fractional months simplify month-difference calculations by abstracting the
difference in length between months. Month-difference values are negative or
positive floating-point values:

- Differences of exact multiples of 1 month are always exact integers
- Differences of more or less than 1-month multiples are fractional values, like
  1.5 or -1.7
- Values are negative when the to-date is earlier than the from-date.
- Non-integer fractional values represent the position of the to-date, relative
  to month boundaries before and after the to-date.
  - Boundaries are at the day/time of the from-date in each month.
- Month boundaries that occur on calendar days that don't exist in all months
  are handled as if the days existed with 0-length — "imaginary days".

See the [module docs](https://jsr.io/@h4l/fractional-months) for more.

## Install

This module is published on JSR, it can be installed as follows; see
[JSR's Using packages page](https://jsr.io/docs/using-packages) for more info.

```console
# deno
deno add @h4l/fractional-months

# npm (one of the below, depending on your package manager)
npx jsr add @h4l/fractional-months
yarn dlx jsr add @h4l/fractional-months
pnpm dlx jsr add @h4l/fractional-months
bunx jsr add @h4l/fractional-months
```
