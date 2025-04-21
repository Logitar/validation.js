import { describe, it, expect, test } from "vitest";

import required from "../required";
import { RuleExecutionOutcome } from "../../types";

describe("required", () => {
  test.each([NaN, 0])("should return invalid when the number is NaN or 0", (value) => {
    const outcome = required(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a number different from 0.");
  });

  test.each(["", "   "])("should return invalid when the string is empty or white-space", (value) => {
    const outcome = required(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} cannot be an empty string.");
  });

  it.concurrent("should return invalid when the array is empty", () => {
    const outcome = required([]) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} cannot be an empty array.");
  });

  test.each([undefined, null, false, 0n])("should return invalid when the value is falsy", (value) => {
    const outcome = required(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} is required.");
  });

  test.each([1, 123, 123.456])("should return valid when the number is not NaN or 0", (value) => {
    const outcome = required(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });

  it.concurrent("should return valid when the string is not empty", () => {
    const outcome = required("hello world") as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });

  it.concurrent("should return valid when the array is not empty", () => {
    const outcome = required([1, 2, 3]) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });

  test.each([{}, true, 1n])("should return valid when the value is not falsy", (value) => {
    const outcome = required(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
