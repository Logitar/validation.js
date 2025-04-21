import { describe, it, expect, test } from "vitest";

import email from "../email";
import { RuleExecutionOutcome } from "../../types";

describe("email", () => {
  test.each([undefined, null, {}, [], true, 0, 0n])("should return invalid when the value is not a string", (value) => {
    const outcome = email(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a string.");
  });

  test.each([null, {}, [], 0, 0n])("should return warning when the args are not valid", (args) => {
    const outcome = email("test@example.com", args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("warning");
    expect(outcome.message).toBe("The arguments must be undefined, or a valid email address validation regular expression.");
  });

  it.concurrent("should return invalid when the value is not a valid email address", () => {
    const outcome = email("aa@@bb..cc") as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a valid email address.");
  });

  it.concurrent("should return valid when the value is a valid email address", () => {
    const outcome = email("test@example.com") as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });

  it.concurrent("should return valid when the value matches the arguments pattern", () => {
    const outcome = email("test@example.com", /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
