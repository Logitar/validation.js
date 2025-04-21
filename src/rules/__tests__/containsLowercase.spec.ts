import { describe, it, expect, test } from "vitest";

import containsLowercase from "../containsLowercase";
import { RuleExecutionOutcome } from "../../types";

describe("containsLowercase", () => {
  test.each([undefined, null, {}, [], true, 0, 0n])("should return invalid when the value is not a string", (value) => {
    const outcome = containsLowercase(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a string.");
  });

  test.each([undefined, null, {}, [], ["1", "b"], false, -1.23, 0, -1n, 0n, "invalid", "-10", "0"])(
    "should return warning when the args is not a positive number",
    (args) => {
      const outcome = containsLowercase("AAaa!!11", args) as RuleExecutionOutcome;
      expect(outcome.severity).toBe("warning");
      expect(outcome.message).toBe("The arguments should be a positive number.");
    },
  );

  it.concurrent("should return invalid when the value does not contain enough lowercase letters", () => {
    const outcome = containsLowercase("AAaa!!11", 3) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must contain at least {{containsLowercase}} lowercase letter(s).");
  });

  test.each([
    ["AAaa!!11", true],
    ["AAaa!!11", ["2"]],
    ["AAaa!!11", 2n],
    ["AAaa!!11", 2],
    ["AAaa!!11", "2"],
  ])("should return valid when the value contains enough lowercase letters", (value, args) => {
    const outcome = containsLowercase(value, args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
