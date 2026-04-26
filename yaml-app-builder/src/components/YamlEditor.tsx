import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export type YamlFileKey = 'app' | 'state' | 'timers' | 'screens';

interface YamlEditorProps {
  files: Record<YamlFileKey, string>;
  errors: Record<YamlFileKey, string | null>;
  onChange: (key: YamlFileKey, value: string) => void;
}

const FILE_LABELS: Record<YamlFileKey, string> = {
  app: 'app.yaml',
  state: 'state.yaml',
  timers: 'timers.yaml',
  screens: 'screens.yaml',
};

const FILE_COLORS: Record<YamlFileKey, string> = {
  app: '#6366f1',
  state: '#10b981',
  timers: '#f59e0b',
  screens: '#3b82f6',
};

export function YamlEditor({ files, errors, onChange }: YamlEditorProps) {
  const [activeFile, setActiveFile] = useState<YamlFileKey>('app');

  return (
    <View style={styles.container}>
      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {(Object.keys(FILE_LABELS) as YamlFileKey[]).map((key) => {
          const isActive = activeFile === key;
          const hasError = Boolean(errors[key]);
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveFile(key)}
              style={[
                styles.tab,
                isActive && { borderBottomColor: FILE_COLORS[key], borderBottomWidth: 2 },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isActive && { color: FILE_COLORS[key], fontWeight: '600' },
                  hasError && styles.tabError,
                ]}
              >
                {FILE_LABELS[key]}
                {hasError ? ' ⚠' : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Error banner */}
      {errors[activeFile] && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errors[activeFile]}</Text>
        </View>
      )}

      {/* Editor */}
      <ScrollView style={styles.editorScroll} keyboardDismissMode="on-drag">
        <TextInput
          style={[styles.editor, { borderColor: errors[activeFile] ? '#ef4444' : '#374151' }]}
          multiline
          value={files[activeFile]}
          onChangeText={(text) => onChange(activeFile, text)}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          textAlignVertical="top"
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    flexGrow: 0,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: { color: '#9ca3af', fontSize: 13 },
  tabError: { color: '#fca5a5' },
  errorBanner: {
    backgroundColor: '#450a0a',
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
    padding: 10,
  },
  errorText: { color: '#fca5a5', fontSize: 12, fontFamily: 'monospace' },
  editorScroll: { flex: 1 },
  editor: {
    flex: 1,
    backgroundColor: '#111827',
    color: '#e5e7eb',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
    padding: 12,
    borderWidth: 0,
    minHeight: 400,
  },
});
