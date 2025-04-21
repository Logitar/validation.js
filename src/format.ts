/**
 * Defines a message formatter.
 */
export interface MessageFormatter {
  /**
   * Formats a message with the given placeholders.
   * @param message The message to format.
   * @param placeholders The placeholders to replace in the message.
   * @returns The formatted message.
   */
  format(message: string, placeholders: Record<string, unknown>): string;
}

/**
 * The default message formatter. This could use [mustache.js](https://github.com/janl/mustache.js), but we don't want to add a dependency for this. We simply replace occurrences of placeholder keys with their values, no other computation.
 */
export class DefaultMessageFormatter implements MessageFormatter {
  /**
   * Formats a message with the given placeholders.
   * @param message The message to format.
   * @param placeholders The placeholders to replace in the message.
   * @returns The formatted message.
   */
  format(message: string, placeholders: Record<string, unknown>): string {
    let formatted: string = message;
    for (const key in placeholders) {
      const pattern = `{{${key}}}`;
      const replacement = String(placeholders[key]);
      formatted = formatted.split(pattern).join(replacement);
    }
    return formatted;
  }
}
