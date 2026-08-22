import type { RuleExecutionOutcome, ValidationRule } from "../types";

/**
 * A validation rule that checks if a value is not equal to another value.
 * @param value The value to validate.
 * @param args The value to compare the value to.
 * @returns The result of the validation rule execution.
 */
const notEqual: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  const isEqual: boolean = typeof value === "object" || typeof args === "object" ? JSON.stringify(value) === JSON.stringify(args) : value === args;
  if (isEqual) {
    return { severity: "error", message: "{{name}} must not equal {{notEqual}}." };
  }
  return { severity: "information" };
};

export default notEqual;
