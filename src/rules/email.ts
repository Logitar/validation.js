import type { RuleExecutionOutcome, ValidationRule } from "../types";

// https://github.com/colinhacks/zod/blob/40e72f9eaf576985f876d1afc2dbc22f73abc1ba/src/types.ts#L595
const defaultRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;

/**
 * A validation rule that checks if a string is a valid email address.
 * @param value The value to validate.
 * @param args The regular expression to validate the email address against.
 * @returns The result of the validation rule execution.
 */
const email: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  if (typeof value !== "string") {
    return { severity: "error", message: "{{name}} must be a string." };
  }

  let isArgsValid: boolean = true;
  let regex: RegExp;
  if (typeof args === "string" || args instanceof RegExp) {
    regex = new RegExp(args);
  } else {
    regex = new RegExp(defaultRegex);
    if (typeof args !== "undefined" && typeof args !== "boolean") {
      isArgsValid = false;
    }
  }

  if (!regex.test(value)) {
    return { severity: "error", message: "{{name}} must be a valid email address." };
  } else if (!isArgsValid) {
    return { severity: "warning", message: "The arguments must be undefined, or a valid email address validation regular expression." };
  }

  return { severity: "information" };
};

export default email;
