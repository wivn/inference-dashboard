import type { StateMap } from '../types/schema';

// Format seconds as "M:SS"
function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
}

// Replace timeFormat(expr) calls within a string before further evaluation.
function applyBuiltins(str: string, state: StateMap): string {
  return str.replace(/timeFormat\(([^)]+)\)/g, (_, inner) => {
    const seconds = evalNumber(inner.trim(), state);
    return formatTime(seconds);
  });
}

// Evaluate a simple expression against the current state.
// Supports: $varName substitution, basic JS-like arithmetic/comparison.
export function evalExpression(expr: string | number | boolean | undefined, state: StateMap): unknown {
  if (expr === undefined || expr === null) return expr;
  if (typeof expr === 'number' || typeof expr === 'boolean') return expr;

  const str = applyBuiltins(String(expr).trim(), state);

  // Pure variable reference: $varName
  if (/^\$[a-zA-Z_][a-zA-Z0-9_]*$/.test(str)) {
    const varName = str.slice(1);
    return state[varName];
  }

  // Template literal-style interpolation for display strings: "Count: $count"
  if (str.includes('$')) {
    return str.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => {
      const val = state[name];
      return val !== undefined ? String(val) : `$${name}`;
    });
  }

  return str;
}

// Evaluate an expression to a boolean (for visible/disabled/active conditions).
export function evalBool(expr: string | boolean | undefined, state: StateMap): boolean {
  if (expr === undefined) return true;
  if (typeof expr === 'boolean') return expr;

  const str = applyBuiltins(String(expr).trim(), state);

  // Handle negation: !expr
  if (str.startsWith('!')) {
    return !evalBool(str.slice(1).trim(), state);
  }

  // Pure variable reference
  if (/^\$[a-zA-Z_][a-zA-Z0-9_]*$/.test(str)) {
    return Boolean(state[str.slice(1)]);
  }

  // Comparison / compound expressions — substitute vars and eval
  const substituted = str.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => {
    const val = state[name];
    if (typeof val === 'string') return JSON.stringify(val);
    return val !== undefined ? String(val) : 'undefined';
  });

  try {
    // eslint-disable-next-line no-new-func
    return Boolean(new Function(`return (${substituted})`)());
  } catch {
    return false;
  }
}

// Evaluate an expression to a number value.
export function evalNumber(expr: string | number | undefined, state: StateMap): number {
  if (expr === undefined) return 0;
  if (typeof expr === 'number') return expr;

  const str = applyBuiltins(String(expr).trim(), state);

  const substituted = str.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => {
    const val = state[name];
    return val !== undefined ? String(val) : '0';
  });

  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return (${substituted})`)();
    return typeof result === 'number' ? result : Number(result);
  } catch {
    return 0;
  }
}

// Resolve a new state value from an action's value expression.
export function resolveNewValue(
  valueExpr: string | number | boolean | undefined,
  state: StateMap
): unknown {
  if (valueExpr === undefined) return undefined;
  if (typeof valueExpr === 'number' || typeof valueExpr === 'boolean') return valueExpr;

  const str = applyBuiltins(String(valueExpr).trim(), state);

  // Boolean literals
  if (str === 'true') return true;
  if (str === 'false') return false;

  // Negation of a variable: !$varName
  if (str.startsWith('!$')) {
    const name = str.slice(2);
    return !state[name];
  }

  // Arithmetic or comparison with variable references
  if (str.includes('$')) {
    const substituted = str.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => {
      const val = state[name];
      if (typeof val === 'string') return JSON.stringify(val);
      return val !== undefined ? String(val) : 'undefined';
    });
    try {
      // eslint-disable-next-line no-new-func
      return new Function(`return (${substituted})`)();
    } catch {
      return substituted;
    }
  }

  // Plain string or number literal
  const num = Number(str);
  if (!isNaN(num) && str !== '') return num;
  return str;
}
