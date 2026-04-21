import type { TDiagnostic } from '@/registry/default/ui/code/code-editor';

const NUMSCRIPT_API_ENDPOINT =
  'https://numscript-playground-api-prod.fly.dev/run';

/**
 * Numscript validation context - balances, variables, and metadata
 * that can be provided to validate variable references and account balances
 */
type TNumscriptValidationContext = {
  balances?: Record<string, Record<string, number>>;
  variables?: Record<string, string>;
  metadata?: Record<string, Record<string, string>>;
};

/**
 * Parse numscript API error response into individual diagnostics
 *
 * The API returns errors in this format:
 * ```
 * Got errors while parsing:
 * missing '(' at '['
 *   0 | // Transfer funds between accounts
 *   1 | sendd [USD/2 100] (
 *     |       ~~~
 *   2 |   source = @foo
 * ```
 *
 * Each error block starts with a message, followed by context lines showing
 * the error location with line numbers (N |) and position markers (~~~ or spaces).
 */
function parseNumscriptErrors(errorResponse: string): TDiagnostic[] {
  const diagnostics: TDiagnostic[] = [];

  // Split by double newlines to separate error blocks
  // Each error starts with a message followed by code context
  const errorBlocks = errorResponse.split(/\n\n+/);

  for (const block of errorBlocks) {
    if (!block.trim()) continue;

    // Skip the "Got errors while parsing:" header
    if (block.startsWith('Got errors')) continue;

    const lines = block.split('\n');
    if (lines.length === 0) continue;

    // First line is the error message (e.g., "missing '(' at '['")
    const message = lines[0]?.trim() || 'Syntax error';

    // Find the line with the error marker (~~~, ^, or just spaces under the error)
    // Look for lines like "    |       ~~~" or "    | ~~~~~~"
    let errorLine = 1;
    let startColumn = 1;
    let endColumn = 2;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i] || '';

      // Match lines like "  1 | sendd [USD/2 100] (" to get line number
      const codeLineMatch = line.match(/^\s*(\d+)\s*\|/);
      if (codeLineMatch && codeLineMatch[1]) {
        // This is a code line - remember the line number
        // API uses 0-based line numbers, Monaco uses 1-based
        errorLine = parseInt(codeLineMatch[1], 10) + 1;
      }

      // Match marker lines like "    |       ~~~" or "    | ~~~~~~"
      // The format is: `| ` (pipe + separator space) then markers aligned with code
      const markerMatch = line.match(/^\s*\| ([\s~^]+)$/);
      if (markerMatch && markerMatch[1]) {
        const marker = markerMatch[1];
        // Find where the marker starts (first non-space) and ends
        const markerStart = marker.search(/[~^]/);
        const markerEnd =
          marker.lastIndexOf('~') + 1 || marker.lastIndexOf('^') + 1;

        if (markerStart >= 0) {
          // +1 because Monaco columns are 1-based
          startColumn = markerStart + 1;
          endColumn = Math.max(markerEnd + 1, startColumn + 1);
        }
        // Stop after finding the marker — errorLine is the code line
        // immediately above the marker, which is the correct error location
        break;
      }
    }

    diagnostics.push({
      startLineNumber: errorLine,
      startColumn,
      endLineNumber: errorLine,
      endColumn,
      message,
      severity: 'error',
    });
  }

  return diagnostics;
}

/**
 * Validate numscript code using the numscript playground API
 *
 * @param script - The numscript code to validate
 * @param context - Optional validation context (balances, variables, metadata)
 * @returns Array of diagnostics (errors/warnings)
 */
async function validateNumscript(
  script: string,
  context?: TNumscriptValidationContext
): Promise<TDiagnostic[]> {
  if (!script.trim()) {
    return [];
  }

  try {
    const response = await fetch(NUMSCRIPT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script,
        balances: context?.balances ?? {},
        metadata: context?.metadata ?? {},
        variables: context?.variables ?? {},
        featureFlags: [],
      }),
    });

    if (!response.ok) {
      // Network or server error - don't show as validation error
      return [];
    }

    const result = await response.json();

    if (result.ok === false && result.error) {
      return parseNumscriptErrors(result.error);
    }

    // Script is valid
    return [];
  } catch {
    // Network error or other issue - don't show as validation error
    return [];
  }
}

/**
 * Create a numscript validator function with optional context.
 * This is a convenience wrapper for use with CodeEditor's diagnostics prop.
 *
 * @param context - Optional validation context (balances, variables, metadata)
 * @returns A validation function compatible with TDiagnosticsConfig.validate
 */
function createNumscriptValidator(context?: TNumscriptValidationContext) {
  return (script: string) => validateNumscript(script, context);
}

export {
  createNumscriptValidator,
  parseNumscriptErrors,
  validateNumscript,
  type TNumscriptValidationContext,
};
