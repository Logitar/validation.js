import type { RuleExecutionOutcome, ValidationRule } from "../types";

/**
 * A validation rule that checks if a string or an array is longer than a minimum length.
 * @param value The value to validate.
 * @param args The minimum length.
 * @returns The result of the validation rule execution.
 */
const minimumLength: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  const minimumLength: number = Number(args);
  if (isNaN(minimumLength) || minimumLength <= 0) {
    return { severity: "warning", message: "The arguments should be a positive number." };
  }

  if (typeof value === "string") {
    if (value.length < minimumLength) {
      return { severity: "error", message: "{{name}} must be at least {{minimumLength}} character(s) long." };
    }
  } else if (Array.isArray(value)) {
    if (value.length < minimumLength) {
      return { severity: "error", message: "{{name}} must contain at least {{minimumLength}} element(s)." };
    }
  } else {
    return { severity: "error", message: "{{name}} must be a string or an array." };
  }

  return { severity: "information" };
};

export default minimumLength;
