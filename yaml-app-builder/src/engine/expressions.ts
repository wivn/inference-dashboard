import type { StateMap } from '../types/schema';

// --- Path resolution ---

// Resolve a dot-path like "exercise.sets" or "item" from state.
function resolvePath(path: string, state: StateMap): unknown {
  const parts = path.split('.');
  let val: unknown = state[parts[0]];
  for (let i = 1; i < parts.length; i++) {
    if (val === null || val === undefined) break;
    val = (val as Record<string, unknown>)[parts[i]];
  }
  return val;
}

// Substitute all $varName and $var.prop.sub references in a string.
function substituteVars(str: string, state: StateMap, quote = false): string {
  return str.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)/g, (_, path) => {
    const val = resolvePath(path, state);
    if (val === undefined) return `$${path}`;
    if (quote && typeof val === 'string') return JSON.stringify(val);
    return String(val);
  });
}

// Format seconds as "M:SS"
function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// Apply built-in function calls (timeFormat) before further evaluation.
function applyBuiltins(str: string, state: StateMap): string {
  return str.replace(/timeFormat\(([^)]+)\)/g, (_, inner) => {
    return formatTime(evalNumber(inner.trim(), state));
  });
}

// Detect if a string looks like an expression to evaluate rather than
// a plain interpolation template.
function looksLikeExpression(str: string): boolean {
  return /[\?:+\-*/><=!&|]/.test(str) || /\b(true|false|undefined|null)\b/.test(str);
}

// --- Public API ---

// Evaluate an expression against state. Returns the resolved value.
export function evalExpression(
  expr: string | number | boolean | undefined,
  state: StateMap
): unknown {
  if (expr === undefined || expr === null) return expr;
  if (typeof expr === 'number' || typeof expr === 'boolean') return expr;

  let str = String(expr).trim();
  str = applyBuiltins(str, state);

  // Pure dot-path variable: $var or $var.field.sub
  if (/^\$[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*$/.test(str)) {
    return resolvePath(str.slice(1), state);
  }

  // If it contains operators, evaluate fully via Function
  if (str.includes('$') && looksLikeExpression(str)) {
    const substituted = substituteVars(str, state, true);
    try {
      // eslint-disable-next-line no-new-func
      return new Function(`return (${substituted})`)();
    } catch {
      // fall through to template interpolation
    }
  }

  // Plain template: "Hello $name" → "Hello Alice"
  if (str.includes('$')) {
    return substituteVars(str, state);
  }

  return str;
}

// Evaluate to boolean (visible / disabled / timer active).
export function evalBool(expr: string | boolean | undefined, state: StateMap): boolean {
  if (expr === undefined) return true;
  if (typeof expr === 'boolean') return expr;

  let str = String(expr).trim();
  str = applyBuiltins(str, state);

  if (str.startsWith('!')) {
    return !evalBool(str.slice(1).trim(), state);
  }

  if (/^\$[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*$/.test(str)) {
    return Boolean(resolvePath(str.slice(1), state));
  }

  const substituted = substituteVars(str, state, true);
  try {
    // eslint-disable-next-line no-new-func
    return Boolean(new Function(`return (${substituted})`)());
  } catch {
    return false;
  }
}

// Evaluate to number.
export function evalNumber(expr: string | number | undefined, state: StateMap): number {
  if (expr === undefined) return 0;
  if (typeof expr === 'number') return expr;

  let str = String(expr).trim();
  str = applyBuiltins(str, state);

  const substituted = substituteVars(str, state);
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

  let str = String(valueExpr).trim();
  str = applyBuiltins(str, state);

  if (str === 'true') return true;
  if (str === 'false') return false;

  // Pure negation: !$varName or !$var.field
  if (str.startsWith('!$')) {
    return !resolvePath(str.slice(2), state);
  }

  // Pure dot-path variable
  if (/^\$[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*$/.test(str)) {
    return resolvePath(str.slice(1), state);
  }

  if (str.includes('$') || looksLikeExpression(str)) {
    const substituted = substituteVars(str, state, true);
    try {
      // eslint-disable-next-line no-new-func
      return new Function(`return (${substituted})`)();
    } catch {
      return substituted;
    }
  }

  const num = Number(str);
  if (!isNaN(num) && str !== '') return num;
  return str;
}

// Resolve a style object, evaluating any string values as expressions.
export function resolveStyle(
  style: Record<string, unknown> | undefined,
  state: StateMap
): Record<string, unknown> {
  if (!style) return {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(style)) {
    if (typeof v === 'string' && (v.includes('$') || looksLikeExpression(v))) {
      out[k] = resolveNewValue(v, state);
    } else {
      out[k] = v;
    }
  }
  return out;
}
