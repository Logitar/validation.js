import type { RuleExecutionOutcome, ValidationRule } from "../types";

/**
 * A validation rule that checks if a string contains a minimum number of unique characters.
 * @param value The value to validate.
 * @param args The minimum number of unique characters.
 * @returns The result of the validation rule execution.
 */
const uniqueCharacters: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  const uniqueCharacters: number = Number(args);
  if (isNaN(uniqueCharacters) || uniqueCharacters <= 0) {
    return { severity: "warning", message: "The arguments should be a positive number." };
  }

  if (typeof value !== "string") {
    return { severity: "error", message: "{{name}} must be a string." };
  } else if (value.length > 0) {
    const count: number = [...new Set(value)].length;
    if (count < uniqueCharacters) {
      return { severity: "error", message: "{{name}} must contain at least {{uniqueCharacters}} unique character(s)." };
    }
  }

  return { severity: "information" };
};

export default uniqueCharacters;
