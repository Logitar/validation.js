import { describe, it, expect, test } from "vitest";

import uniqueCharacters from "../uniqueCharacters";
import { RuleExecutionOutcome } from "../../types";

describe("uniqueCharacters", () => {
  test.each([undefined, null, {}, [], true, 0, 0n])("should return invalid when the value is not a string", (value) => {
    const outcome = uniqueCharacters(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a string.");
  });

  test.each([undefined, null, {}, [], false, 0, 0n])("should return warning when the args is not a positive number", (args) => {
    const outcome = uniqueCharacters("test", args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("warning");
    expect(outcome.message).toBe("The arguments should be a positive number.");
  });

  it.concurrent("should return invalid when the value does not have enough unique characters", () => {
    const outcome = uniqueCharacters("AAaa!!11", 5) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must contain at least {{uniqueCharacters}} unique character(s).");
  });

  it.concurrent("should return valid when the value has enough unique characters", () => {
    const outcome = uniqueCharacters("AAaa!!11", 4) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
