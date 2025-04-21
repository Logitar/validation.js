import { stringUtils } from "logitar-js";

import type { RuleExecutionOutcome, ValidationRule } from "../types";

const { isNullOrWhiteSpace } = stringUtils;

/**
 * A validation rule that checks if a required value is provided.
 * @param value The value to validate.
 * @returns The result of the validation rule execution.
 */
const required: ValidationRule = (value: unknown): RuleExecutionOutcome => {
  switch (typeof value) {
    case "number":
      if (isNaN(value) || value === 0) {
        return { severity: "error", message: "{{name}} must be a number different from 0." };
      }
      break;
    case "string":
      if (isNullOrWhiteSpace(value)) {
        return { severity: "error", message: "{{name}} cannot be an empty string." };
      }
      break;
    default:
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return { severity: "error", message: "{{name}} cannot be an empty array." };
        }
      } else if (!Boolean(value)) {
        return { severity: "error", message: "{{name}} is required." };
      }
      break;
  }
  return { severity: "information" };
};

export default required;
