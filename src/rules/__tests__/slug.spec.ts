import { describe, it, expect, test } from "vitest";

import slug from "../slug";
import { RuleExecutionOutcome } from "../../types";

describe("slug", () => {
  test.each([undefined, null, {}, [], true, 0, 0n])("should return invalid when the value is not a string", (value) => {
    const outcome = slug(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a string.");
  });

  it.concurrent("should return invalid when the value contains an empty word", () => {
    const outcome = slug("aa--bb") as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be composed of non-empty alphanumeric words separated by hyphens (-).");
  });

  it.concurrent("should return invalid when the value contains non-alphanumeric characters", () => {
    const outcome = slug("invalid!") as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be composed of non-empty alphanumeric words separated by hyphens (-).");
  });

  test.each(["valid", "valid-123"])("should return valid when the value is a valid slug", (value) => {
    const outcome = slug(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });
});
