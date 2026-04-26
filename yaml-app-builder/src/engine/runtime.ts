import { useEffect, useRef, useCallback } from 'react';
import type { Timer, TimerAction, StateMap } from '../types/schema';
import { evalBool, resolveNewValue } from './expressions';

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

        // Check if timer is active
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
