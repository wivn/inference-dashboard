import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { YamlEditor, YamlFileKey } from './YamlEditor';
import { AppRuntime } from './AppRuntime';
import { parseAppBundle, parseYamlSafe } from '../engine/parser';
import type { AppBundle } from '../types/schema';
import {
  EXAMPLE_APP_YAML,
  EXAMPLE_STATE_YAML,
  EXAMPLE_TIMERS_YAML,
  EXAMPLE_SCREENS_YAML,
} from '../examples/counter';
import {
  TODO_APP_YAML,
  TODO_STATE_YAML,
  TODO_TIMERS_YAML,
  TODO_SCREENS_YAML,
} from '../examples/todo';
import {
  WORKOUT_APP_YAML,
  WORKOUT_STATE_YAML,
  WORKOUT_TIMERS_YAML,
  WORKOUT_SCREENS_YAML,
} from '../examples/workout';

const EXAMPLES: Record<string, Record<YamlFileKey, string>> = {
  'Push / Pull': {
    app: WORKOUT_APP_YAML,
    state: WORKOUT_STATE_YAML,
    timers: WORKOUT_TIMERS_YAML,
    screens: WORKOUT_SCREENS_YAML,
  },
  Stopwatch: {
    app: EXAMPLE_APP_YAML,
    state: EXAMPLE_STATE_YAML,
    timers: EXAMPLE_TIMERS_YAML,
    screens: EXAMPLE_SCREENS_YAML,
  },
  'Todo List': {
    app: TODO_APP_YAML,
    state: TODO_STATE_YAML,
    timers: TODO_TIMERS_YAML,
    screens: TODO_SCREENS_YAML,
  },
};

type Tab = 'editor' | 'preview';

function validateFile(key: YamlFileKey, content: string): string | null {
  const { error } = parseYamlSafe(content);
  return error;
}

export function Builder() {
  const [tab, setTab] = useState<Tab>('editor');

  const [files, setFiles] = useState({
    app: WORKOUT_APP_YAML,
    state: WORKOUT_STATE_YAML,
    timers: WORKOUT_TIMERS_YAML,
    screens: WORKOUT_SCREENS_YAML,
  });

  const [errors, setErrors] = useState<Record<YamlFileKey, string | null>>({
    app: null,
    state: null,
    timers: null,
    screens: null,
  });

  const [bundle, setBundle] = useState<AppBundle | null>(() => {
    try {
      return parseAppBundle({
        app: WORKOUT_APP_YAML,
        state: WORKOUT_STATE_YAML,
        timers: WORKOUT_TIMERS_YAML,
        screens: WORKOUT_SCREENS_YAML,
      });
    } catch {
      return null;
    }
  });

  const [bundleError, setBundleError] = useState<string | null>(null);

  const handleFileChange = useCallback((key: YamlFileKey, value: string) => {
    const fileError = validateFile(key, value);
    setFiles((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: fileError }));
  }, []);

  const handleRunPreview = useCallback(() => {
    // Re-validate all files
    const newErrors: Record<YamlFileKey, string | null> = {
      app: validateFile('app', files.app),
      state: validateFile('state', files.state),
      timers: validateFile('timers', files.timers),
      screens: validateFile('screens', files.screens),
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    try {
      const parsed = parseAppBundle(files);
      setBundle(parsed);
      setBundleError(null);
      setTab('preview');
    } catch (e) {
      setBundleError((e as Error).message);
    }
  }, [files]);

  const handleLoadExample = useCallback((name: string) => {
    const ex = EXAMPLES[name];
    if (!ex) return;
    setFiles(ex);
    setErrors({ app: null, state: null, timers: null, screens: null });
    setBundleError(null);
    try {
      setBundle(parseAppBundle(ex));
    } catch {
      setBundle(null);
    }
  }, []);

  const hasAnyError = Object.values(errors).some(Boolean);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>YAML App Builder</Text>
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            onPress={() => setTab('editor')}
            style={[styles.tabBtn, tab === 'editor' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, tab === 'editor' && styles.tabBtnTextActive]}>
              Editor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('preview')}
            style={[styles.tabBtn, tab === 'preview' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, tab === 'preview' && styles.tabBtnTextActive]}>
              Preview
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Editor tab */}
      {tab === 'editor' && (
        <View style={styles.editorContainer}>
          {/* Example picker */}
          <View style={styles.exampleBar}>
            <Text style={styles.exampleLabel}>Examples:</Text>
            {Object.keys(EXAMPLES).map((name) => (
              <TouchableOpacity
                key={name}
                onPress={() => handleLoadExample(name)}
                style={styles.exampleChip}
              >
                <Text style={styles.exampleChipText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <YamlEditor files={files} errors={errors} onChange={handleFileChange} />

          {bundleError && (
            <View style={styles.bundleError}>
              <Text style={styles.bundleErrorText}>{bundleError}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleRunPreview}
            style={[styles.runBtn, hasAnyError && styles.runBtnDisabled]}
          >
            <Text style={styles.runBtnText}>
              {hasAnyError ? 'Fix YAML errors to run' : 'Run Preview →'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Preview tab */}
      {tab === 'preview' && (
        <View style={styles.previewContainer}>
          {bundle ? (
            // Key on bundle so it fully remounts when YAML changes
            <AppRuntime key={JSON.stringify(bundle.app)} bundle={bundle} />
          ) : (
            <View style={styles.noPreview}>
              <Text style={styles.noPreviewText}>
                Fix any YAML errors and tap "Run Preview" in the editor.
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  topBarTitle: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  tabBtnActive: {
    backgroundColor: '#6366f1',
  },
  tabBtnText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  tabBtnTextActive: { color: '#ffffff' },
  editorContainer: { flex: 1 },
  exampleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  exampleLabel: { color: '#64748b', fontSize: 12 },
  exampleChip: {
    backgroundColor: '#334155',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  exampleChipText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  bundleError: {
    backgroundColor: '#450a0a',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ef4444',
  },
  bundleErrorText: { color: '#fca5a5', fontSize: 12, fontFamily: 'monospace' },
  runBtn: {
    backgroundColor: '#6366f1',
    padding: 16,
    alignItems: 'center',
  },
  runBtnDisabled: { backgroundColor: '#374151' },
  runBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  previewContainer: { flex: 1 },
  noPreview: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  noPreviewText: { color: '#64748b', fontSize: 16, textAlign: 'center', lineHeight: 24 },
});
