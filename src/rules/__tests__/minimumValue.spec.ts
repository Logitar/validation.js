import { describe, it, expect, test } from "vitest";

import minimumValue from "../minimumValue";
import { RuleExecutionOutcome } from "../../types";

describe("minimumValue", () => {
  test.each([
    [false, true],
    [-1, 1],
    [-10n, 10n],
    ["abc", "def"],
    [123, "456"],
    [new Date("2000-01-01"), new Date("2010-01-01")],
    [null, new Date()],
    [-Infinity, Infinity],
  ])("should return invalid when the value is lower than args", (value, args) => {
    const outcome = minimumValue(value, args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be at least {{minimumValue}}.");
  });

  test.each([
    [true, false],
    [true, true],
    [1, -1],
    [0, 0],
    [10n, -10n],
    [100n, 100n],
    [789, "456"],
    ["def", "abc"],
    ["ghi", "ghi"],
    [new Date("2020-01-01"), new Date("2010-01-01")],
    [new Date("2000-01-01"), new Date("2000-01-01")],
    [new Date(), null],
    [NaN, -Infinity],
    [undefined, -Infinity],
  ])("should return valid when the value is greater than or equal to args", (value, args) => {
    const outcome = minimumValue(value, args) as RuleExecutionOutcome;
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
    const outcome = minimumValue(a, b) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("warning");
    expect(outcome.message).toBe("Could not compare {{name}} ({{value}} | object) with args ({{minimumValue}} | number).");
  });
});
