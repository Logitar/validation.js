import { describe, it, expect, test } from "vitest";

import maximumLength from "../maximumLength";
import { RuleExecutionOutcome } from "../../types";

describe("maximumLength", () => {
  test.each([undefined, null, {}, [], false, 0, 0n])("should return warning when the args is not a positive number", (args) => {
    const outcome = maximumLength("test", args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("warning");
    expect(outcome.message).toBe("The arguments should be a positive number.");
  });

  it.concurrent("should return invalid when the value is a string that is too long", () => {
    const outcome = maximumLength("test", true) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be at most {{maximumLength}} character(s) long.");
  });

  it.concurrent("should return invalid when the value is an array that is too long", () => {
    const outcome = maximumLength([1, 2, 3], 2) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must contain at most {{maximumLength}} element(s).");
  });

  test.each([undefined, null, {}, false, 0, 0n])("should return invalid when the value is not a string or an array", (value) => {
    const outcome = maximumLength(value, 1) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a string or an array.");
  });

  it.concurrent("should return valid when the value is a string that is not too long", () => {
    const outcome = maximumLength("test", 5) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });

  it.concurrent("should return valid when the value is an array that is not too long", () => {
    const outcome = maximumLength([1, 2, 3], 3) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
