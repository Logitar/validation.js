import type { RuleExecutionOutcome, ValidationRule } from "../types";

/**
 * A validation rule that checks if a value is equal to another value.
 * @param value The value to validate.
 * @param args The value to compare the value to.
 * @returns The result of the validation rule execution.
 */
const confirm: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  const isValid: boolean = typeof value === "object" || typeof args === "object" ? JSON.stringify(value) === JSON.stringify(args) : value === args;
  if (!isValid) {
    return { severity: "error", message: "{{name}} must equal {{confirm}}." };
  }
  return { severity: "information" };
};

export default confirm;
