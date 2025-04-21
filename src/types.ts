import { MessageFormatter } from "./format";

/**
 * Defines the outcome of the execution of a validation rule.
 */
export type RuleExecutionOutcome = {
  /**
   * The severity of the outcome.
   */
  severity: ValidationSeverity;
  /**
   * The key of the rule that was executed.
   */
  key?: string;
  /**
   * The message of the outcome.
   */
  message?: string;
  /**
   * The message placeholders of the outcome.
   */
  placeholders?: Record<string, unknown>;
  /**
   * The name of the field/property that was validated.
   */
  name?: string;
  /**
   * The value of the field/property that was validated.
   */
  value?: unknown;
  /**
   * Custom state that was provided by the validation rule.
   */
  custom?: unknown;
};

/**
 * Defines the result of the execution of a validation rule.
 */
export type RuleExecutionResult = {
  /**
   * The key of the rule that was executed.
   */
  key: string;
  /**
   * The severity of the result.
   */
  severity: ValidationSeverity;
  /**
   * The message of the result.
   */
  message?: string;
  /**
   * The message placeholders of the result.
   */
  placeholders: Record<string, unknown>;
  /**
   * The name of the field/property that was validated.
   */
  name: string;
  /**
   * The value of the field/property that was validated.
   */
  value: unknown;
  /**
   * Custom state that was provided by the validation rule.
   */
  custom?: unknown;
};

/**
 * Defines the configuration of a validation rule.
 */
export type RuleConfiguration = {
  /**
   * The validation rule to execute.
   */
  rule: ValidationRule;
  /**
   * The options of the rule execution.
   */
  options: RuleOptions;
};

/**
 * Defines the options of a validation rule execution.
 */
export type RuleOptions = {
  /**
   * Overrides the key of the rule.
   */
  key?: string;
  /**
   * Overrides the message of the rule.
   */
  message?: string;
  /**
   * Provides additional placeholders for the rule message.
   */
  placeholders?: Record<string, unknown>;
};

/**
 * Defines a validation context. The context is shared between validation rules and returned in the result.
 */
export type ValidationContext = Record<string, unknown>;

/**
 * Defines the options of a validation operation.
 */
export type ValidationOptions = {
  /**
   * The context of the validation opteration.
   */
  context?: ValidationContext;
  /**
   * The message formatter to use.
   */
  messageFormatter?: MessageFormatter;
  /**
   * Provides additional placeholders for the validation messages.
   */
  placeholders?: Record<string, unknown>;
  /**
   * A value indicating whether the validation should throw an error if the validation fails.
   */
  throwOnFailure?: boolean;
  /**
   * A value indicating whether warnings should be treated as errors.
   */
  treatWarningsAsErrors?: boolean;
};

/**
 * Defines the result of a validation operation.
 */
export type ValidationResult = {
  /**
   * A value indicating whether the validation was successful.
   */
  isValid: boolean;
  /**
   * The results of the executed validation rules.
   */
  rules: Record<ValidationRuleKey, RuleExecutionResult>;
  /**
   * The context of the validation operation.
   */
  context: ValidationContext;
};

/**
 * Defines a validation rule.
 * @param value The value to validate.
 * @param args Additional arguments to pass to the validation rule.
 * @param context The context of the validation operation.
 * @returns A value indicating whether the validation was successful.
 */
export type ValidationRule = (value: unknown, args?: unknown, context?: ValidationContext) => boolean | ValidationSeverity | RuleExecutionOutcome;

/**
 * Defines the key of a validation rule.
 */
export type ValidationRuleKey = string;

/**
 * Defines a set of validation rules.
 */
export type ValidationRuleSet = Record<ValidationRuleKey, unknown>;

/**
 * Defines the severity of a validation execution outcome.
 * Reference: https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.logging.loglevel
 */
export type ValidationSeverity = "trace" | "debug" | "information" | "warning" | "error" | "critical";

/**
 * Defines the options of a validator.
 */
export type ValidatorOptions = {
  /**
   * The message formatter to use.
   */
  messageFormatter?: MessageFormatter;
  /**
   * A value indicating whether the validator should throw an error if the validation fails.
   */
  throwOnFailure?: boolean;
  /**
   * A value indicating whether warnings should be treated as errors.
   */
  treatWarningsAsErrors?: boolean;
};
