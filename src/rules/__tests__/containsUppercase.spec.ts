import { describe, it, expect, test } from "vitest";

import containsUppercase from "../containsUppercase";
import { RuleExecutionOutcome } from "../../types";

describe("containsUppercase", () => {
  test.each([undefined, null, {}, [], true, 0, 0n])("should return invalid when the value is not a string", (value) => {
    const outcome = containsUppercase(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a string.");
  });

  test.each([undefined, null, {}, [], ["1", "b"], false, -1.23, 0, -1n, 0n, "invalid", "-10", "0"])(
    "should return warning when the args is not a positive number",
    (args) => {
      const outcome = containsUppercase("AAaa!!11", args) as RuleExecutionOutcome;
      expect(outcome.severity).toBe("warning");
      expect(outcome.message).toBe("The arguments should be a positive number.");
    },
  );

  it.concurrent("should return invalid when the value does not contain enough uppercase letters", () => {
    const outcome = containsUppercase("AAaa!!11", 3) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must contain at least {{containsUppercase}} uppercase letter(s).");
  });

  test.each([
    ["AAaa!!11", true],
    ["AAaa!!11", ["2"]],
    ["AAaa!!11", 2n],
    ["AAaa!!11", 2],
    ["AAaa!!11", "2"],
  ])("should return valid when the value contains enough uppercase letters", (value, args) => {
    const outcome = containsUppercase(value, args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
