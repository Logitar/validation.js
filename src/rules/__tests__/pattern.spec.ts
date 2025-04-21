import { describe, it, expect, test } from "vitest";

import rule from "../pattern";
import { RuleExecutionOutcome } from "../../types";

const pattern = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/;

describe("pattern", () => {
  test.each([undefined, null, {}, [], true, 0, 0n])("should return invalid when the value is not a string", (value) => {
    const outcome = rule(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a string.");
  });

  test.each([undefined, null, {}, [], true, 0, 0n])("should return warning when the args is not a regular expression", () => {
    const outcome = rule("") as RuleExecutionOutcome;
    expect(outcome.severity).toBe("warning");
    expect(outcome.message).toBe("The arguments should be a regular expression.");
  });

  test.each(["h2x3y2", "H2X -3Y2", "H2U 3Y2"])("should return invalid when the value does not match the pattern", (value) => {
    const outcome = rule(value, pattern) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must match the pattern {{pattern}}.");
  });

  test.each(["H2X3Y2", "H2X 3Y2", "H2X-3Y2"])("should return valid when the value matches the pattern", (value) => {
    const outcome = rule(value, pattern) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
