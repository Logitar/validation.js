import type { RuleExecutionOutcome, ValidationRule } from "../types";

/**
 * A validation rule that checks if a value is greater than or equal to a minimum value.
 * @param value The value to validate.
 * @param args The minimum value.
 * @returns The result of the validation rule execution.
 */
const minimumValue: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  try {
    if (value < args) {
      return { severity: "error", message: "{{name}} must be at least {{minimumValue}}." };
    }
  } catch (_) {
    return { severity: "warning", message: `Could not compare {{name}} ({{value}} | ${typeof value}) with args ({{minimumValue}} | ${typeof args}).` };
  }
  return { severity: "information" };
};

export default minimumValue;
