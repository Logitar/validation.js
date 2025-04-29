import { stringUtils } from "logitar-js";

import type { RuleExecutionOutcome, ValidationRule } from "../types";

const { trimEnd } = stringUtils;

/**
 * Format a protocol string to be used in a set.
 * @param protocol The protocol to format.
 * @returns The formatted protocol.
 */
function format(protocol: string): string {
  return trimEnd(protocol.trim().toLowerCase(), ":");
}

/**
 * A validation rule that checks if a string is a valid URL.
 * @param value The value to validate.
 * @param args The allowed protocols.
 * @returns The result of the validation rule execution.
 */
const url: ValidationRule = (value: unknown, args: unknown): RuleExecutionOutcome => {
  if (typeof value !== "string") {
    return { severity: "error", message: "{{name}} must be a string." };
  }

  if (value.length > 0) {
    let isArgsValid: boolean = true;
    const protocols: Set<string> = new Set(["http", "https"]);
    if (typeof args !== "undefined") {
      let values: string[] = [];
      if (typeof args === "string") {
        values = args.split(/[,;\|]/);
      } else if (Array.isArray(args)) {
        values = args;
      }
      if (values.length === 0) {
        isArgsValid = false;
      } else {
        values.forEach((value) => protocols.add(format(value)));
      }
    }

    let url: URL;
    try {
      url = new URL(value.trim());
    } catch (_) {
      return { severity: "error", message: "{{name}} must be a valid URL." };
    }

    if (!protocols.has(format(url.protocol))) {
      return { severity: "error", message: `{{name}} must be an URL with one of the following protocols: ${[...protocols].join(", ")}.` };
    }

    if (!isArgsValid) {
      return {
        severity: "warning",
        message:
          "The arguments must be undefined, a string containing the allowed protocols separated by commas, semicolons or pipes, or an array of allowed protocols.",
      };
    }
  }

  return { severity: "information" };
};

export default url;
