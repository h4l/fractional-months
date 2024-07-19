# fractional-months

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
