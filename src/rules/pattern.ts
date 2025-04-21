import type { RuleExecutionOutcome, ValidationRule } from "../types";

/**
 * A validation rule that checks if a string matches a regular expression.
 * @param value The value to validate.
 * @param args The regular expression to validate the string against.
 * @returns The result of the validation rule execution.
 */
const pattern: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  if (typeof value !== "string") {
    return { severity: "error", message: "{{name}} must be a string." };
  } else if (typeof args !== "string" && !(args instanceof RegExp)) {
    return { severity: "warning", message: "The arguments should be a regular expression." };
  } else if (!new RegExp(args).test(value)) {
    return { severity: "error", message: "{{name}} must match the pattern {{pattern}}." };
  }
  return { severity: "information" };
};

export default pattern;
