import { stringUtils } from "logitar-js";

import type { RuleExecutionOutcome, ValidationRule } from "../types";

const { isLetter } = stringUtils;

/**
 * A validation rule that checks if a string contains a minimum number of lowercase letters.
 * @param value The value to validate.
 * @param args The minimum number of lowercase letters.
 * @returns The result of the validation rule execution.
 */
const containsLowercase: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  const requiredLowercase: number = Number(args);
  if (isNaN(requiredLowercase) || requiredLowercase <= 0) {
    return { severity: "warning", message: "The arguments should be a positive number." };
  }

  if (typeof value !== "string") {
    return { severity: "error", message: "{{name}} must be a string." };
  } else if (value.length > 0) {
    const lowercase: number = [...value].filter((c) => isLetter(c) && c.toLowerCase() === c).length;
    if (lowercase < requiredLowercase) {
      return { severity: "error", message: "{{name}} must contain at least {{containsLowercase}} lowercase letter(s)." };
    }
  }

  return { severity: "information" };
};

export default containsLowercase;
