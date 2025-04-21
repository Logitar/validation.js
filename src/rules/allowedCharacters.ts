import type { RuleExecutionOutcome, ValidationRule } from "../types";

/**
 * A validation rule that checks if a string only contains allowed characters.
 * @param value The value to validate.
 * @param args The allowed characters.
 * @returns The result of the validation rule execution.
 */
const allowedCharacters: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  if (typeof value !== "string") {
    return { severity: "error", message: "{{name}} must be a string." };
  } else if (typeof args !== "string") {
    return { severity: "warning", message: "The arguments must be a string containing the allowed characters." };
  }

  const prohibitedCharacters = new Set<string>([...value].filter((c) => !args.includes(c)));
  if (prohibitedCharacters.size > 0) {
    return {
      severity: "error",
      message: `{{name}} contains the following prohibited characters: ${[...prohibitedCharacters].join("")}. Only the following characters are allowed: {{allowedCharacters}}`,
    };
  }

  return { severity: "information" };
};

export default allowedCharacters;
