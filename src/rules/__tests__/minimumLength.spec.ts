import { describe, it, expect, test } from "vitest";

import minimumLength from "../minimumLength";
import { RuleExecutionOutcome } from "../../types";

describe("minimumLength", () => {
  test.each([undefined, null, {}, [], false, 0, 0n])("should return warning when the args is not a positive number", (args) => {
    const outcome = minimumLength("test", args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("warning");
    expect(outcome.message).toBe("The arguments should be a positive number.");
  });

  it.concurrent("should return invalid when the value is a string that is too short", () => {
    const outcome = minimumLength("", true) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be at least {{minimumLength}} character(s) long.");
  });

  it.concurrent("should return invalid when the value is an array that is too short", () => {
    const outcome = minimumLength([1], 2) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must contain at least {{minimumLength}} element(s).");
  });

  test.each([undefined, null, {}, false, 0, 0n])("should return invalid when the value is not a string or an array", (value) => {
    const outcome = minimumLength(value, 1) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a string or an array.");
  });

  it.concurrent("should return valid when the value is a string that is not too short", () => {
    const outcome = minimumLength("AAaa!!11", 5) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });

  it.concurrent("should return valid when the value is an array that is not too short", () => {
    const outcome = minimumLength([1, 2, 3], 2) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
