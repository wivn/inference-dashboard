import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import type { AppBundle, StateMap } from '../types/schema';
import { Renderer } from './Renderer';
import { useTimers } from '../engine/runtime';

interface AppRuntimeProps {
  bundle: AppBundle;
}

export function AppRuntime({ bundle }: AppRuntimeProps) {
  const { app, state: stateSchema, timers: timerSchema, screens: screensSchema } = bundle;

  // Initialize state from schema
  const [state, setStateMap] = useState<StateMap>(() => {
    const initial: StateMap = {};
    for (const v of stateSchema.variables) {
      initial[v.name] = v.initial;
    }
    return initial;
  });

  const [currentScreen, setCurrentScreen] = useState(app.initialScreen);

  const patchState = useCallback((patch: Partial<StateMap>) => {
    setStateMap((prev) => ({ ...prev, ...patch }));
  }, []);

  useTimers(timerSchema.timers, state, patchState, setCurrentScreen);

  const screen = screensSchema.screens.find((s) => s.name === currentScreen);
  const theme = app.theme;

  if (!screen) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Screen "{currentScreen}" not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, theme?.background ? { backgroundColor: theme.background } : undefined]}>
      {screen.title && (
        <View style={[styles.header, theme?.primary ? { backgroundColor: theme.primary } : undefined]}>
          <Text style={styles.headerTitle}>{screen.title}</Text>
        </View>
      )}
      <Renderer
        components={screen.layout}
        state={state}
        onStateChange={patchState}
        onNavigate={setCurrentScreen}
        theme={theme}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#ef4444', fontSize: 16 },
});
