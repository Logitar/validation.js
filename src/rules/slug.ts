import { stringUtils } from "logitar-js";

import type { RuleExecutionOutcome, ValidationRule } from "../types";

const { isLetterOrDigit, isNullOrEmpty } = stringUtils;

/**
 * A validation rule that checks if a string is a valid slug.
 * @param value The value to validate.
 * @returns The result of the validation rule execution.
 */
const slug: ValidationRule = (value: unknown): RuleExecutionOutcome => {
  if (typeof value !== "string") {
    return { severity: "error", message: "{{name}} must be a string." };
  } else if (value.split("-").some((word) => isNullOrEmpty(word) || [...word].some((c) => !isLetterOrDigit(c)))) {
    return { severity: "error", message: "{{name}} must be composed of non-empty alphanumeric words separated by hyphens (-)." };
  }
  return { severity: "information" };
};

export default slug;
