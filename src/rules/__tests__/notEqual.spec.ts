import { describe, it, expect, test } from "vitest";

import notEqual from "../notEqual";
import { RuleExecutionOutcome } from "../../types";

describe("notEqual", () => {
  test.each([
    [undefined, undefined],
    [null, null],
    [
      { age: 20, name: "John" },
      { age: 20, name: "John" },
    ],
    [
      [1, 2, 3],
      [1, 2, 3],
    ],
    [false, false],
    [true, true],
    [0, 0],
    [0n, 0n],
    ["hello world", "hello world"],
  ])("return invalid when the value equals the args", (value, args) => {
    const outcome = notEqual(value, args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must not equal {{notEqual}}.");
  });

  test.each([
    [undefined, "undefined"],
    [null, {}],
    [{ age: 20 }, { name: "John" }],
    [
      [1, 2],
      [3, 4],
    ],
    [false, true],
    [-1, 1],
    [-1n, 1n],
    ["hello", "world"],
  ])("return valid when the value does not equal the args", (value, args) => {
    const outcome = notEqual(value, args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
