import { describe, it, expect, test } from "vitest";

import url from "../url";
import { RuleExecutionOutcome } from "../../types";

describe("url", () => {
  test.each([undefined, null, {}, [], true, 0, 0n])("should return invalid when the value is not a string", (value) => {
    const outcome = url(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a string.");
  });

  test.each(["", "   "])("should return invalid when the value is empty or white-space", (value) => {
    const outcome = url(value) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} cannot be an empty string.");
  });

  it.concurrent("should return invalid when the value is not a valid URL", () => {
    const outcome = url("invalid-url") as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be a valid URL.");
  });

  it.concurrent("should return invalid when the value is not an URL with a valid protocol", () => {
    const outcome = url("ftp://example.com") as RuleExecutionOutcome;
    expect(outcome.severity).toBe("error");
    expect(outcome.message).toBe("{{name}} must be an URL with one of the following protocols: http, https.");
  });

  it.concurrent("should return warning when the args are not valid", () => {
    const outcome = url("http://example.com", 123) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("warning");
    expect(outcome.message).toBe(
      "The arguments must be undefined, a string containing the allowed protocols separated by commas, semicolons or pipes, or an array of allowed protocols.",
    );
  });

  test.each([
    ["http://example.com", undefined],
    ["http://example.com", "http,https"],
    ["http://example.com", "http;https"],
    ["https://example.com", "http|https"],
    ["ftp://example.com", [" FTP: ", " HTTP: "]],
  ])("should return valid when the value is a valid URL with an allowed protocol", (value, args) => {
    const outcome = url(value, args) as RuleExecutionOutcome;
    expect(outcome.severity).toBe("information");
    expect(outcome.message).toBeUndefined();
  });

  test.each([])("should return valid when the value is a valid URL with an allowed protocol", (value) => {});
});
