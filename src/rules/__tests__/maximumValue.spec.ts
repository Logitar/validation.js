import { describe, it, expect, test } from "vitest";

import maximumValue from "../maximumValue";
import { RuleExecutionOutcome } from "../../types";

describe("maximumValue", () => {
  test.each([
    [true, false],
    [1, -1],
    [10n, -10n],
    ["def", "abc"],
    ["456", 123],
    [new Date("2010-01-01"), new Date("2000-01-01")],
    [new Date(), null],
    [Infinity, -Infinity],
  ])("should return invalid when the value is greater than args", (value, args) => {
    const outcome = maximumValue(value, args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be at most {{maximumValue}}.");
  });

  test.each([
    [false, true],
    [false, false],
    [-1, 1],
    [0, 0],
    [-10n, 10n],
    [100n, 100n],
    ["456", 789],
    ["abc", "def"],
    ["ghi", "ghi"],
    [new Date("2010-01-01"), new Date("2020-01-01")],
    [new Date("2000-01-01"), new Date("2000-01-01")],
    [null, new Date()],
    [-Infinity, NaN],
    [-Infinity, undefined],
  ])("should return valid when the value is lower than or equal to args", (value, args) => {
    const outcome = maximumValue(value, args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });

  it.concurrent("should return warning when the values could not be compared", () => {
    const a = {
      valueOf: function () {
        throw new Error("Error during valueOf");
      },
    };
    const b = 5;
    const outcome = maximumValue(a, b) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("warning");
    expect(outcome.message).toBe("Could not compare {{name}} ({{value}} | object) with args ({{maximumValue}} | number).");
  });
});
