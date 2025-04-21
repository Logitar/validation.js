import { describe, it, expect, test } from "vitest";

import rule from "../allowedCharacters";
import { RuleExecutionOutcome } from "../../types";

const allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

describe("allowedCharacters", () => {
  test.each([undefined, null, {}, [], true, 0, 0n])("should return invalid when the value is not a string", (value) => {
    const outcome = rule(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a string.");
  });

  test.each([undefined, null, {}, [], true, 0, 0n])("should return warning when the args are not a string", (args) => {
    const outcome = rule("valid", args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("warning");
    expect(outcome.message).toBe("The arguments must be a string containing the allowed characters.");
  });

  it.concurrent("should return invalid when the value contains prohibited characters", () => {
    const outcome = rule("invalid!", allowedCharacters) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} contains the following prohibited characters: !. Only the following characters are allowed: {{allowedCharacters}}");
  });

  it.concurrent("should return valid when the value only contains allowed characters", () => {
    const outcome = rule("valid", allowedCharacters) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
