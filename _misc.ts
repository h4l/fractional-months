/** Assert that all unions of a type have been [handled in a type-safe way](https://stackoverflow.com/questions/39419170/how-do-i-check-that-a-switch-block-is-exhaustive-in-typescript/39419171#39419171). */
export function assertUnreachable(_value: never, message?: string): never {
  unreachable(message);
}

/** Always fail when called.
 *
 * Used to assert that a code path that cannot be executed at runtime, to
 * satisfy the type checker.
 */
export function unreachable(message?: string): never {
  throw new AssertionError(message ?? "unreachable");
}

/** Error thrown when an assertion fails. */
export class AssertionError extends Error {
  get name(): string {
    return this.constructor.name;
  }
}
