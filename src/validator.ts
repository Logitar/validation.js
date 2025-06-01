import { stringUtils } from "logitar-js";

import { DefaultMessageFormatter, type MessageFormatter } from "./format";

const { isNullOrWhiteSpace } = stringUtils;

import type {
  RuleConfiguration,
  RuleExecutionOutcome,
  RuleExecutionResult,
  RuleOptions,
  ValidationContext,
  ValidationOptions,
  ValidationResult,
  ValidationRule,
  ValidationRuleKey,
  ValidationRuleSet,
  ValidationSeverity,
  ValidatorOptions,
} from "./types";

/**
 * Applies the execution outcome of a validation rule to a result.
 * @param result The result to apply the execution outcome to.
 * @param outcome The execution outcome of the validation rule execution.
 * @param options The options of the validation rule execution.
 */
function apply(result: RuleExecutionResult, outcome: RuleExecutionOutcome, options: RuleOptions): void {
  // severity
  result.severity = outcome.severity;
  // key
  if (!isNullOrWhiteSpace(options.key)) {
    result.key = options.key;
  } else if (!isNullOrWhiteSpace(outcome.key)) {
    result.key = outcome.key;
  }
  // message
  if (!isNullOrWhiteSpace(options.message)) {
    result.message = options.message;
  } else if (!isNullOrWhiteSpace(outcome.message)) {
    result.message = outcome.message;
  }
  // name
  if (!isNullOrWhiteSpace(outcome.name)) {
    result.name = outcome.name;
  }
  // value
  if (typeof outcome.value !== "undefined") {
    result.value = outcome.value;
  }
  // custom
  result.custom = outcome.custom;
}

/**
 * Fills the placeholders of a validation rule execution.
 * @param result The result to fill the placeholders of.
 * @param outcome The execution outcome of the validation rule.
 * @param rule The options of the validation rule execution.
 * @param validation The options of the validation operation.
 */
function fillPlaceholders(result: RuleExecutionResult, outcome?: RuleExecutionOutcome, rule?: RuleOptions, validation?: ValidationOptions): void {
  result.placeholders.key = result.key;
  result.placeholders.name = result.name;
  result.placeholders.value = result.value;
  result.placeholders.severity = result.severity;

  if (outcome && outcome.placeholders) {
    result.placeholders = { ...result.placeholders, ...outcome.placeholders };
  }
  if (rule && rule.placeholders) {
    result.placeholders = { ...result.placeholders, ...rule.placeholders };
  }
  if (validation && validation.placeholders) {
    result.placeholders = { ...result.placeholders, ...validation.placeholders };
  }
}

/**
 * A validator is a collection of validation rules that can be executed on a value.
 */
class Validator {
  /**
   * The message formatter to use.
   */
  private readonly messageFormatter: MessageFormatter;
  /**
   * The rules registered to this validator.
   */
  private readonly rules: Map<ValidationRuleKey, RuleConfiguration>;
  /**
   * A value indicating whether the validator should throw an error if the validation fails.
   */
  private readonly throwOnFailure: boolean;
  /**
   * A value indicating whether warnings should be treated as errors.
   */
  private readonly treatWarningsAsErrors: boolean;

  /**
   * Initializes a new instance of the Validator class.
   * @param options The options of the validator.
   */
  constructor(options?: ValidatorOptions) {
    options ??= {};
    this.messageFormatter = options.messageFormatter ?? new DefaultMessageFormatter();
    this.rules = new Map();
    this.throwOnFailure = options.throwOnFailure ?? false;
    this.treatWarningsAsErrors = options.treatWarningsAsErrors ?? false;
  }

  /**
   * Clears all the rules registered to this validator.
   */
  clearRules(): void {
    this.rules.clear();
  }

  /**
   * Gets a rule from the validator.
   * @param key The key of the rule to get.
   * @returns The rule configuration.
   */
  getRule(key: ValidationRuleKey): RuleConfiguration | undefined {
    return this.rules.get(key);
  }

  /**
   * Checks if a rule is registered to this validator.
   * @param key The key of the rule to check.
   * @returns A value indicating whether the rule is registered to this validator.
   */
  hasRule(key: ValidationRuleKey): boolean {
    return this.rules.has(key);
  }

  /**
   * Lists all the rules registered to this validator.
   * @returns The rules registered to this validator.
   */
  listRules(): [ValidationRuleKey, RuleConfiguration][] {
    return [...this.rules.entries()];
  }

  /**
   * Removes a rule from the validator.
   * @param key The key of the rule to remove.
   * @returns A value indicating whether the rule was removed from the validator.
   */
  removeRule(key: ValidationRuleKey): boolean {
    return this.rules.delete(key);
  }

  /**
   * Registers a rule to the validator.
   * @param key The key of the rule to register.
   * @param rule The rule to register.
   * @param options The options of the rule.
   */
  setRule(key: ValidationRuleKey, rule: ValidationRule, options?: RuleOptions): void {
    options ??= {};
    const configuration: RuleConfiguration = { rule, options };
    this.rules.set(key, configuration);
  }

  /**
   * Validates a field/property against a set of rules.
   * @param name The name of the field/property to validate.
   * @param value The value of the field/property to validate.
   * @param rules The rule set to validate the value against.
   * @param options The options of the validation operation.
   * @returns The result of the validation operation.
   */
  validate(name: string, value: unknown, rules: ValidationRuleSet, options?: ValidationOptions): ValidationResult {
    options ??= {};
    const context: ValidationContext = options.context ?? {};

    let errors: number = 0;
    const results: Record<ValidationRuleKey, RuleExecutionResult> = {};

    const missingRules: string[] = [];
    for (const key in rules) {
      const configuration: RuleConfiguration | undefined = this.rules.get(key);
      if (!configuration) {
        missingRules.push(key);
        continue;
      }

      const args: unknown = rules[key];
      if (typeof args === "undefined" || args === null || args === false || args === "" || (typeof args === "number" && isNaN(args))) {
        // NOTE(fpion): 0, -0 and 0n (BigInt) are considered valid arguments.
        continue;
      }

      const result: RuleExecutionResult = {
        key,
        severity: "error",
        placeholders: { [key]: args },
        name,
        value,
      };

      const outcome: boolean | ValidationSeverity | RuleExecutionOutcome = configuration.rule(value, args, context);
      switch (typeof outcome) {
        case "boolean":
          result.severity = Boolean(outcome) ? "information" : "error";
          break;
        case "string":
          result.severity = outcome;
          break;
        default:
          apply(result, outcome, configuration.options);
          break;
      }

      fillPlaceholders(result, typeof outcome === "object" ? outcome : undefined, configuration.options, options);

      this.formatMessage(result, options);

      if (this.isError(result.severity, options)) {
        errors++;
      }

      results[key] = result;
    }

    if (missingRules.length > 0) {
      throw new Error(`The following rules are not registered: ${missingRules.join(", ")}`);
    }

    const result: ValidationResult = {
      isValid: errors === 0,
      rules: results,
      context,
    };
    if (!result.isValid && (options.throwOnFailure ?? this.throwOnFailure)) {
      throw result;
    }
    return result;
  }

  /**
   * Formats a validation rule execution message.
   * @param result The result to format the message of.
   * @param options The options of the validation operation.
   */
  private formatMessage(result: RuleExecutionResult, options?: ValidationOptions): void {
    options ??= {};
    const messageFormatter: MessageFormatter = options.messageFormatter ?? this.messageFormatter;
    if (typeof result.message === "string") {
      result.message = messageFormatter.format(result.message, result.placeholders);
    }
  }

  /**
   * Checks if a severity is an error.
   * @param severity The severity to check.
   * @param options The options of the validation operation.
   * @returns A value indicating whether the severity is an error.
   */
  private isError(severity: ValidationSeverity, options?: ValidationOptions): boolean {
    options ??= {};
    switch (severity) {
      case "error":
      case "critical":
        return true;
      case "warning":
        if (options.treatWarningsAsErrors ?? this.treatWarningsAsErrors) {
          return true;
        }
        break;
    }
    return false;
  }
}
export default Validator;
