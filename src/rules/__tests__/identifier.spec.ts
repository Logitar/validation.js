import { describe, it, expect, test } from "vitest";

import identifier from "../identifier";
import { RuleExecutionOutcome } from "../../types";

describe("identifier", () => {
  test.each([undefined, null, {}, [], true, 0, 0n])("should return invalid when the value is not a string", (value) => {
    const outcome = identifier(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a string.");
  });

  it.concurrent("should return invalid when the value is an empty string", () => {
    const outcome = identifier("") as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} cannot be an empty string.");
  });

  it.concurrent("should return invalid when the value starts with a digit", () => {
    const outcome = identifier("123") as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} cannot start with a digit.");
  });

  it.concurrent("should return invalid when the value contains non-alphanumeric characters", () => {
    const outcome = identifier("invalid_123!") as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} may only contain letters, digits and underscores (_).");
  });

  test.each(["_valid", "valid_123", "valid"])("should return valid when the value is a valid identifier", (value) => {
    const outcome = identifier(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
