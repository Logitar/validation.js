import { describe, it, expect } from "vitest";

import Validator from "../validator";
import containsNonAlphanumeric from "../rules/containsNonAlphanumeric";
import email from "../rules/email";
import required from "../rules/required";
import type {
  RuleConfiguration,
  RuleExecutionOutcome,
  RuleOptions,
  ValidationContext,
  ValidationResult,
  ValidationRule,
  ValidationRuleKey,
  ValidationSeverity,
} from "../types";

const required_alt: ValidationRule = (value: unknown): boolean => {
  return Boolean(value);
};

const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
const email_alt: ValidationRule = (value: unknown): ValidationSeverity => {
  const isValid: boolean = typeof value === "string" && emailRegex.test(value);
  return isValid ? "information" : "error";
};

const not_empty: ValidationRule = (value: unknown, _, context: ValidationContext | undefined): RuleExecutionOutcome => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  let name: string = "";
  if (context && context.name) {
    name = context.name as string;
  }
  return {
    severity: trimmed.length > 0 ? "information" : "error",
    key: "NotEmptyValidator",
    message: "{{name}} ({{original}} → {{value}}) cannot be an empty string.",
    placeholders: { original: value, value: trimmed },
    name: "'" + name + "'",
    value: trimmed,
    custom: { value, trimmed },
  };
};

describe("Validator", () => {
  it.concurrent("should clear all registered rules", () => {
    const validator = new Validator();
    validator.setRule("email", email);
    validator.setRule("required", required);
    validator.clearRules();
    expect(validator.listRules().length).toBe(0);
  });

  it.concurrent("should get a specific rule", () => {
    const validator = new Validator();
    validator.setRule("email", email);
    validator.setRule("required", required);
    const configuration: RuleConfiguration | undefined = validator.getRule("email");
    expect(configuration).toBeDefined();
    expect(configuration?.rule).toBe(email);
    expect(configuration?.options).toEqual({});
  });

  it.concurrent("should return undefined when a rule has not been registered", () => {
    const validator = new Validator();
    validator.setRule("required", required);
    const configuration: RuleConfiguration | undefined = validator.getRule("email");
    expect(configuration).toBeUndefined();
  });

  it.concurrent("should check if a rule has been registered", () => {
    const validator = new Validator();
    expect(validator.hasRule("required")).toBe(false);
    validator.setRule("required", required);
    expect(validator.hasRule("required")).toBe(true);
  });

  it.concurrent("should list all registered rules", () => {
    const validator = new Validator();
    let rules: [ValidationRuleKey, RuleConfiguration][] = validator.listRules();
    expect(rules.length).toBe(0);
    validator.setRule("email", email);
    validator.setRule("required", required);
    rules = validator.listRules();
    expect(rules.length).toBe(2);
    expect(rules[0][0]).toBe("email");
    expect(rules[1][0]).toBe("required");
  });

  it.concurrent("should remove a rule", () => {
    const validator = new Validator();
    validator.setRule("email", email);
    validator.setRule("required", required);
    validator.removeRule("email");
    expect(validator.hasRule("email")).toBe(false);
    expect(validator.hasRule("required")).toBe(true);
  });

  it.concurrent("should register a rule without options", () => {
    const validator = new Validator();
    validator.setRule("email", email);
    const configuration: RuleConfiguration | undefined = validator.getRule("email");
    expect(configuration).toBeDefined();
    expect(configuration?.rule).toBe(email);
    expect(configuration?.options).toEqual({});
  });

  it.concurrent("should register a rule with options", () => {
    const validator = new Validator();
    const options: RuleOptions = {
      key: "EmailAddressValidator",
      message: "{{name}} n’est pas une adresse courriel valide.",
      placeholders: { locale: "fr" },
    };
    validator.setRule("email", email, options);
    const configuration: RuleConfiguration | undefined = validator.getRule("email");
    expect(configuration).toBeDefined();
    expect(configuration?.rule).toBe(email);
    expect(JSON.stringify(configuration?.options)).toBe(JSON.stringify(options));
  });

  it.concurrent("should not execute validation rules when args are falsy", () => {
    const validator = new Validator();
    validator.setRule("email", email);
    validator.setRule("required", required);
    const result: ValidationResult = validator.validate("email", "test@example.com", { required: true, email: false });
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.rules).length).toBe(1);
    expect(result.rules.required.severity).toBe("information");
    expect(result.context).toEqual({});
  });

  it.concurrent("should throw an error when a rule has not been registered", () => {
    const validator = new Validator();
    validator.setRule("required", required);
    expect(() => validator.validate("email", "test@example.com", { required: true, email: false })).toThrowError();
  });

  it.concurrent("should succeed when all validation rules are satisfied", () => {
    const validator = new Validator();
    validator.setRule("required", required);
    validator.setRule("email", email);
    const result: ValidationResult = validator.validate("email", "test@example.com", { required: true, email: true });
    expect(result.isValid).toBe(true);
    expect(result.rules.required.severity).toBe("information");
    expect(result.rules.email.severity).toBe("information");
  });

  it.concurrent("should succeed when warnings are not treated as errors (ctor)", () => {
    const validator = new Validator({ treatWarningsAsErrors: false });
    validator.setRule("required", required);
    validator.setRule("email", email);
    const result: ValidationResult = validator.validate("email", "test@example.com", { required: true, email: 1 });
    expect(result.isValid).toBe(true);
    expect(result.rules.required.severity).toBe("information");
    expect(result.rules.email.severity).toBe("warning");
  });

  it.concurrent("should succeed when warnings are not treated as errors (validate)", () => {
    const validator = new Validator({ treatWarningsAsErrors: false });
    validator.setRule("required", required);
    validator.setRule("email", email);
    const result: ValidationResult = validator.validate("email", "test@example.com", { required: true, email: 1 }, { treatWarningsAsErrors: false });
    expect(result.isValid).toBe(true);
    expect(result.rules.required.severity).toBe("information");
    expect(result.rules.email.severity).toBe("warning");
  });

  it.concurrent("should throw an error when throwing on failure (ctor)", () => {
    const validator = new Validator({ throwOnFailure: true });
    validator.setRule("required", required);
    expect(() => validator.validate("email", undefined, { required: true }, { throwOnFailure: undefined })).toThrowError();
  });

  it.concurrent("should throw an error when throwing on failure (validator)", () => {
    const validator = new Validator({ throwOnFailure: false });
    validator.setRule("required", required);
    expect(() => validator.validate("email", undefined, { required: true }, { throwOnFailure: true })).toThrowError();
  });

  it.concurrent("should fail when some validation rules fail", () => {
    const validator = new Validator();
    validator.setRule("required", required);
    validator.setRule("email", email);
    validator.setRule("containsNonAlphanumeric", containsNonAlphanumeric);
    const result: ValidationResult = validator.validate("email", "test@example.com", { required: true, email: true, containsNonAlphanumeric: 3 });
    expect(result.isValid).toBe(false);
    expect(result.rules.required.severity).toBe("information");
    expect(result.rules.email.severity).toBe("information");
    expect(result.rules.containsNonAlphanumeric.severity).toBe("error");
    expect(result.rules.containsNonAlphanumeric.message).toBe("email must contain at least 3 non-alphanumeric character(s).");
  });

  it.concurrent("should fail when warnings are treated as errors (ctor)", () => {
    const validator = new Validator({ treatWarningsAsErrors: true });
    validator.setRule("required", required);
    validator.setRule("email", email);
    const result: ValidationResult = validator.validate("email", "test@example.com", { required: true, email: 1 }, { treatWarningsAsErrors: undefined });
    expect(result.isValid).toBe(false);
    expect(result.rules.required.severity).toBe("information");
    expect(result.rules.email.severity).toBe("warning");
    expect(result.rules.email.message).toBe("The arguments must be undefined, or a valid email address validation regular expression.");
  });

  it.concurrent("should fail when warnings are treated as errors (validate)", () => {
    const validator = new Validator({ treatWarningsAsErrors: false });
    validator.setRule("required", required);
    validator.setRule("email", email);
    const result = validator.validate("email", "test@example.com", { required: true, email: 1 }, { treatWarningsAsErrors: true });
    expect(result.isValid).toBe(false);
    expect(result.rules.required.severity).toBe("information");
    expect(result.rules.email.severity).toBe("warning");
    expect(result.rules.email.message).toBe("The arguments must be undefined, or a valid email address validation regular expression.");
  });

  it.concurrent("should use key and message rule override", () => {
    const validator = new Validator();
    validator.setRule("required", required);
    validator.setRule("email", email, { key: "EmailAddressValidator", message: "{{name}} doit être une adresse courriel valide." });
    const result: ValidationResult = validator.validate("email", "test@example.com", { required: true, email: true });
    expect(result.isValid).toBe(true);
    expect(result.rules.required.severity).toBe("information");
    expect(result.rules.required.key).toBe("required");
    expect(result.rules.required.message).toBeUndefined();
    expect(result.rules.email.severity).toBe("information");
    expect(result.rules.email.key).toBe("EmailAddressValidator");
    expect(result.rules.email.message).toBe("email doit être une adresse courriel valide.");
  });

  it.concurrent("should use placeholders provided in the rule options", () => {
    const validator = new Validator();
    validator.setRule("required", required, { placeholders: { name: "This field" } });
    const result: ValidationResult = validator.validate("email", "   ", { required: true });
    expect(result.isValid).toBe(false);
    expect(result.rules.required.message).toBe("This field cannot be an empty string.");
    expect(result.rules.required.placeholders.name).toBe("This field");
  });

  it.concurrent("should use placeholders provided in the validation options", () => {
    const validator = new Validator();
    validator.setRule("required", required);
    const result: ValidationResult = validator.validate("email", "   ", { required: true }, { placeholders: { name: "This field" } });
    expect(result.isValid).toBe(false);
    expect(result.rules.required.message).toBe("This field cannot be an empty string.");
    expect(result.rules.required.placeholders.name).toBe("This field");
  });

  it.concurrent("should handle rules returning a boolean value (invalid)", () => {
    const validator = new Validator();
    validator.setRule("required", required_alt);
    const result: ValidationResult = validator.validate("email", "", { required: true });
    expect(result.isValid).toBe(false);
    expect(result.rules.required.severity).toBe("error");
    expect(result.rules.required.message).toBeUndefined();
  });

  it.concurrent("should handle rules returning a boolean value (valid)", () => {
    const validator = new Validator();
    validator.setRule("required", required_alt);
    const result: ValidationResult = validator.validate("email", "test@example.com", { required: true });
    expect(result.isValid).toBe(true);
    expect(result.rules.required.severity).toBe("information");
    expect(result.rules.required.message).toBeUndefined();
  });

  it.concurrent("should handle rules returning a validation severity (invalid)", () => {
    const validator = new Validator();
    validator.setRule("email", email_alt);
    const result: ValidationResult = validator.validate("email", "", { email: true });
    expect(result.isValid).toBe(false);
    expect(result.rules.email.severity).toBe("error");
    expect(result.rules.email.message).toBeUndefined();
  });

  it.concurrent("should handle rules returning a validation severity (valid)", () => {
    const validator = new Validator();
    validator.setRule("email", email_alt);
    const result: ValidationResult = validator.validate("email", "test@example.com", { email: true });
    expect(result.isValid).toBe(true);
    expect(result.rules.email.severity).toBe("information");
    expect(result.rules.email.message).toBeUndefined();
  });

  it.concurrent("should handle rule execution outcome values", () => {
    const validator = new Validator();
    validator.setRule("notEmpty", not_empty);
    const result: ValidationResult = validator.validate("email", "   ", { notEmpty: true }, { context: { name: "email" } });
    expect(result.isValid).toBe(false);
    expect(result.rules.notEmpty.severity).toBe("error");
    expect(result.rules.notEmpty.key).toBe("NotEmptyValidator");
    expect(result.rules.notEmpty.message).toBe("'email' (    → ) cannot be an empty string.");
    expect(result.rules.notEmpty.name).toBe("'email'");
    expect(result.rules.notEmpty.value).toBe("");
    expect(JSON.stringify(result.rules.notEmpty.custom)).toBe(JSON.stringify({ value: "   ", trimmed: "" }));
  });
});
