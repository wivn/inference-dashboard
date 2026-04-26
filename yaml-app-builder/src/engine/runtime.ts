import { useEffect, useRef, useCallback } from 'react';
import type { Timer, TimerAction, StateMap } from '../types/schema';
import { evalBool, evalNumber, resolveNewValue } from './expressions';

// Execute a list of actions against current state, returning the next state patch.
export function executeActions(
  actions: TimerAction[],
  state: StateMap,
  onNavigate?: (screen: string) => void
): Partial<StateMap> {
  const patch: Partial<StateMap> = {};

  for (const action of actions) {
    const currentState = { ...state, ...patch };

    switch (action.type) {
      case 'setState': {
        if (action.variable) {
          patch[action.variable] = resolveNewValue(action.value as string | number | boolean, currentState);
        }
        break;
      }
      case 'increment': {
        if (action.variable) {
          const current = Number(currentState[action.variable] ?? 0);
          patch[action.variable] = current + (action.amount ?? 1);
        }
        break;
      }
      case 'decrement': {
        if (action.variable) {
          const current = Number(currentState[action.variable] ?? 0);
          patch[action.variable] = current - (action.amount ?? 1);
        }
        break;
      }
      case 'navigate': {
        if (action.screen && onNavigate) {
          onNavigate(action.screen);
        }
        break;
      }
      case 'toggleItemField': {
        if (!action.variable || action.field === undefined) break;
        const arr = [...((currentState[action.variable] as Record<string, unknown>[]) ?? [])];
        const idx = Math.round(evalNumber(String(action.index ?? 0), currentState));
        if (idx >= 0 && idx < arr.length) {
          arr[idx] = { ...(arr[idx] as Record<string, unknown>), [action.field]: !(arr[idx] as Record<string, unknown>)[action.field] };
        }
        patch[action.variable] = arr;
        break;
      }
      case 'setItemField': {
        if (!action.variable || action.field === undefined) break;
        const arr = [...((currentState[action.variable] as Record<string, unknown>[]) ?? [])];
        const idx = Math.round(evalNumber(String(action.index ?? 0), currentState));
        if (idx >= 0 && idx < arr.length) {
          arr[idx] = { ...(arr[idx] as Record<string, unknown>), [action.field]: resolveNewValue(action.value as string | number | boolean, currentState) };
        }
        patch[action.variable] = arr;
        break;
      }
      case 'toggleNestedItem': {
        // Toggles array[outerIndex].innerField[innerIndex]  (or its .field if an object)
        if (!action.variable || !action.innerField) break;
        const outer = [...((currentState[action.variable] as Record<string, unknown>[]) ?? [])];
        const outerIdx = Math.round(evalNumber(String(action.outerIndex ?? 0), currentState));
        if (outerIdx < 0 || outerIdx >= outer.length) break;

        const outerItem = { ...(outer[outerIdx] as Record<string, unknown>) };
        const inner = [...((outerItem[action.innerField] as unknown[]) ?? [])];
        const innerIdx = Math.round(evalNumber(String(action.innerIndex ?? 0), currentState));
        if (innerIdx < 0 || innerIdx >= inner.length) break;

        if (action.field) {
          // Item is an object — toggle its field
          inner[innerIdx] = {
            ...(inner[innerIdx] as Record<string, unknown>),
            [action.field]: !(inner[innerIdx] as Record<string, unknown>)[action.field],
          };
        } else {
          // Item is a primitive boolean — flip it directly
          inner[innerIdx] = !inner[innerIdx];
        }

        outerItem[action.innerField] = inner;
        outer[outerIdx] = outerItem;
        patch[action.variable] = outer;
        break;
      }
    }
  }

  return patch;
}

// Hook that manages all timers for a running app.
export function useTimers(
  timers: Timer[],
  state: StateMap,
  setState: (patch: Partial<StateMap>) => void,
  onNavigate?: (screen: string) => void
) {
  const stateRef = useRef(state);
  stateRef.current = state;

  const setupTimers = useCallback(() => {
    const handles: ReturnType<typeof setInterval>[] = [];

    for (const timer of timers) {
      const id = setInterval(() => {
        const current = stateRef.current;

        const isActive = timer.active !== undefined ? evalBool(timer.active, current) : true;
        if (!isActive) return;

        const patch = executeActions(timer.actions, current, onNavigate);
        if (Object.keys(patch).length > 0) {
          setState(patch);
        }
      }, timer.interval);

      handles.push(id);
    }

    return handles;
  }, [timers, setState, onNavigate]);

  useEffect(() => {
    const handles = setupTimers();
    return () => {
      for (const id of handles) clearInterval(id);
    };
  }, [setupTimers]);
}
