import { stringUtils } from "logitar-js";

import type { RuleExecutionOutcome, ValidationRule } from "../types";

const { isLetterOrDigit } = stringUtils;

/**
 * A validation rule that checks if a string contains a minimum number of non-alphanumeric characters.
 * @param value The value to validate.
 * @param args The minimum number of non-alphanumeric characters.
 * @returns The result of the validation rule execution.
 */
const containsNonAlphanumeric: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  if (typeof value !== "string") {
    return { severity: "error", message: "{{name}} must be a string." };
  }

  const requiredNonAlphanumeric: number = Number(args);
  if (isNaN(requiredNonAlphanumeric) || requiredNonAlphanumeric <= 0) {
    return { severity: "warning", message: "The arguments should be a positive number." };
  }

  const nonAlphanumeric: number = [...value].filter((c) => !isLetterOrDigit(c)).length;
  if (nonAlphanumeric < requiredNonAlphanumeric) {
    return { severity: "error", message: "{{name}} must contain at least {{containsNonAlphanumeric}} non-alphanumeric character(s)." };
  }

  return { severity: "information" };
};

export default containsNonAlphanumeric;
