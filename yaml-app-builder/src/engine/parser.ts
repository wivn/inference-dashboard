import * as yaml from 'js-yaml';
import type { AppBundle, AppSchema, StateSchema, TimerSchema, ScreensSchema } from '../types/schema';

export interface YamlFiles {
  app: string;
  state: string;
  timers: string;
  screens: string;
}

export function parseAppBundle(files: YamlFiles): AppBundle {
  const app = yaml.load(files.app) as AppSchema;
  const state = yaml.load(files.state) as StateSchema;
  const timers = yaml.load(files.timers) as TimerSchema;
  const screens = yaml.load(files.screens) as ScreensSchema;

  if (!app || !app.name || !app.initialScreen) {
    throw new Error('app.yaml must have name and initialScreen fields');
  }
  if (!state || !Array.isArray(state.variables)) {
    throw new Error('state.yaml must have a variables array');
  }
  if (!timers || !Array.isArray(timers.timers)) {
    throw new Error('timers.yaml must have a timers array');
  }
  if (!screens || !Array.isArray(screens.screens)) {
    throw new Error('screens.yaml must have a screens array');
  }

  return { app, state, timers, screens };
}

export function parseYamlSafe(content: string): { data: unknown; error: string | null } {
  try {
    const data = yaml.load(content);
    return { data, error: null };
  } catch (e) {
    return { data: null, error: (e as Error).message };
  }
}
