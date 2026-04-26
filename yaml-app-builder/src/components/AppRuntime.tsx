import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import type { AppBundle, StateMap } from '../types/schema';
import { Renderer, InlineRenderer } from './Renderer';
import { useTimers } from '../engine/runtime';
import { evalBool } from '../engine/expressions';

interface AppRuntimeProps {
  bundle: AppBundle;
}

export function AppRuntime({ bundle }: AppRuntimeProps) {
  const { app, state: stateSchema, timers: timerSchema, screens: screensSchema } = bundle;

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
  const resolvedTheme = {
    primary: theme?.primary ?? '#6366f1',
    background: theme?.background ?? '#ffffff',
    text: theme?.text ?? '#111827',
  };

  if (!screen) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Screen "{currentScreen}" not found.</Text>
      </SafeAreaView>
    );
  }

  const overlayVisible =
    screen.overlay && (screen.overlay.visible ? evalBool(screen.overlay.visible, state) : true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: resolvedTheme.background }]}>
      {screen.title && (
        <View style={[styles.header, { backgroundColor: resolvedTheme.primary }]}>
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

      {/* Screen-level overlay (e.g. rest timer) */}
      {screen.overlay && overlayVisible && (
        <View
          style={[
            styles.overlay,
            screen.overlay.position === 'top' ? styles.overlayTop : styles.overlayBottom,
            {
              backgroundColor:
                screen.overlay.backgroundColor ?? resolvedTheme.primary,
            },
          ]}
        >
          <InlineRenderer
            components={screen.overlay.children}
            state={state}
            onStateChange={patchState}
            onNavigate={setCurrentScreen}
            theme={{
              // Invert text on bright overlay backgrounds
              primary: resolvedTheme.background,
              background: screen.overlay.backgroundColor ?? resolvedTheme.primary,
              text: resolvedTheme.background,
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
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
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  overlayBottom: { bottom: 0 },
  overlayTop: { top: 0 },
});
