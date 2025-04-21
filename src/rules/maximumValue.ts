import type { RuleExecutionOutcome, ValidationRule } from "../types";

/**
 * A validation rule that checks if a value is less than or equal to a maximum value.
 * @param value The value to validate.
 * @param args The maximum value.
 * @returns The result of the validation rule execution.
 */
const maximumValue: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  try {
    if (value > args) {
      return { severity: "error", message: "{{name}} must be at most {{maximumValue}}." };
    }
  } catch (_) {
    return { severity: "warning", message: `Could not compare {{name}} ({{value}} | ${typeof value}) with args ({{maximumValue}} | ${typeof args}).` };
  }
  return { severity: "information" };
};

export default maximumValue;
