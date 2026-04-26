import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import type {
  AnyComponent,
  StateMap,
  ComponentStyle,
  ButtonComponent,
  TextComponent,
  InputComponent,
  ProgressComponent,
  ContainerComponent,
  ListComponent,
  BadgeComponent,
  GridComponent,
  WorkoutComponent,
  TimerAction,
} from '../types/schema';
import { evalExpression, evalBool, evalNumber } from '../engine/expressions';
import { executeActions } from '../engine/runtime';

export interface RendererProps {
  components: AnyComponent[];
  state: StateMap;
  onStateChange: (patch: Partial<StateMap>) => void;
  onNavigate?: (screen: string) => void;
  theme?: { primary?: string; background?: string; text?: string };
}

interface ResolvedTheme {
  primary: string;
  background: string;
  text: string;
}

function resolveStyle(style: ComponentStyle | undefined): object {
  if (!style) return {};
  return style as object;
}

interface ComponentProps {
  component: AnyComponent;
  state: StateMap;
  onAction: (actions: TimerAction[]) => void;
  onStateChange: (patch: Partial<StateMap>) => void;
  onNavigate?: (screen: string) => void;
  theme: ResolvedTheme;
}

function RenderComponent({ component, state, onAction, onStateChange, onNavigate, theme }: ComponentProps) {
  const visible = component.visible !== undefined ? evalBool(component.visible, state) : true;
  if (!visible) return null;

  const customStyle = resolveStyle(component.style);

  switch (component.type) {
    case 'text': {
      const c = component as TextComponent;
      const value = String(evalExpression(c.value, state) ?? '');
      return (
        <Text style={[styles.text, { color: theme.text }, customStyle]}>
          {value}
        </Text>
      );
    }

    case 'heading': {
      const c = component as TextComponent;
      const value = String(evalExpression(c.value, state) ?? '');
      return (
        <Text style={[styles.heading, { color: theme.text }, customStyle]}>
          {value}
        </Text>
      );
    }

    case 'button': {
      const c = component as ButtonComponent;
      const label = String(evalExpression(c.label, state) ?? '');
      const disabled = c.disabled ? evalBool(c.disabled, state) : false;
      const isPrimary = !c.variant || c.variant === 'primary';
      const isDanger = c.variant === 'danger';
      const isGhost = c.variant === 'ghost';

      const bgColor = isGhost
        ? 'transparent'
        : isDanger
        ? '#ef4444'
        : isPrimary
        ? theme.primary
        : '#6b7280';

      return (
        <TouchableOpacity
          onPress={() => !disabled && onAction(c.actions)}
          style={[
            styles.button,
            { backgroundColor: bgColor, opacity: disabled ? 0.4 : 1 },
            isGhost && { ...styles.buttonGhost, borderColor: theme.primary },
            customStyle,
          ]}
          disabled={disabled}
        >
          <Text style={[styles.buttonText, isGhost && { color: theme.primary }]}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    }

    case 'input': {
      const c = component as InputComponent;
      const value = String(state[c.variable] ?? '');
      return (
        <View style={[styles.inputWrapper, customStyle]}>
          {c.label && <Text style={[styles.inputLabel, { color: theme.text }]}>{c.label}</Text>}
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.primary }]}
            value={value}
            placeholder={c.placeholder ?? ''}
            placeholderTextColor="#9ca3af"
            keyboardType={c.inputType === 'number' ? 'numeric' : 'default'}
            onChangeText={(text) => {
              const newVal = c.inputType === 'number' ? (isNaN(Number(text)) ? text : Number(text)) : text;
              onStateChange({ [c.variable]: newVal });
            }}
          />
        </View>
      );
    }

    case 'progress': {
      const c = component as ProgressComponent;
      const pct = Math.min(100, Math.max(0, evalNumber(c.value, state)));
      const label = c.label ? String(evalExpression(c.label, state) ?? '') : undefined;
      const color = c.color ?? theme.primary;
      return (
        <View style={[styles.progressWrapper, customStyle]}>
          {label && <Text style={[styles.progressLabel, { color: theme.text }]}>{label}</Text>}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` as unknown as number, backgroundColor: color }]} />
          </View>
        </View>
      );
    }

    case 'spacer': {
      const size = (component as { size?: number }).size ?? 16;
      return <View style={{ height: size }} />;
    }

    case 'divider': {
      return <View style={[styles.divider, customStyle]} />;
    }

    case 'badge': {
      const c = component as BadgeComponent;
      const value = String(evalExpression(c.value, state) ?? '');
      const color = c.color ?? theme.primary;
      return (
        <View style={[styles.badge, { backgroundColor: color }, customStyle]}>
          <Text style={styles.badgeText}>{value}</Text>
        </View>
      );
    }

    case 'row':
    case 'column':
    case 'card': {
      const c = component as ContainerComponent;
      const isRow = c.type === 'row';
      const isCard = c.type === 'card';

      return (
        <View
          style={[
            isRow ? styles.row : styles.column,
            isCard && styles.card,
            c.gap ? { gap: c.gap } : undefined,
            customStyle,
          ]}
        >
          {c.children?.map((child, i) => (
            <RenderComponent
              key={child.id ?? i}
              component={child}
              state={state}
              onAction={onAction}
              onStateChange={onStateChange}
              onNavigate={onNavigate}
              theme={theme}
            />
          ))}
        </View>
      );
    }

    case 'list': {
      const c = component as ListComponent;
      const varName = c.items.replace(/^\$/, '');
      const items = (state[varName] as unknown[]) ?? [];
      return (
        <FlatList
          data={items}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <RenderComponent
              component={c.template}
              state={{ ...state, item, itemIndex: index }}
              onAction={onAction}
              onStateChange={onStateChange}
              onNavigate={onNavigate}
              theme={theme}
            />
          )}
          style={customStyle as object}
          scrollEnabled={false}
        />
      );
    }

    case 'grid': {
      const c = component as GridComponent;
      const columns = c.columns ?? 2;
      const gap = c.gap ?? 8;
      return (
        <View
          style={[
            { flexDirection: 'row', flexWrap: 'wrap', margin: -(gap / 2) },
            customStyle,
          ]}
        >
          {c.children?.map((child, i) => {
            const span = Math.min(child.span ?? 1, columns);
            const pct = `${(span / columns) * 100}%` as `${number}%`;
            return (
              <View key={child.id ?? i} style={{ width: pct, padding: gap / 2 }}>
                <RenderComponent
                  component={child}
                  state={state}
                  onAction={onAction}
                  onStateChange={onStateChange}
                  onNavigate={onNavigate}
                  theme={theme}
                />
              </View>
            );
          })}
        </View>
      );
    }

    case 'workout': {
      const c = component as WorkoutComponent;
      const varName = c.exercises.replace(/^\$/, '');
      const exercises = (state[varName] as Array<{
        name: string;
        reps: string;
        rest: number;
        sets: boolean[];
      }>) ?? [];

      return (
        <View style={customStyle}>
          {exercises.map((exercise, exerciseIdx) => {
            const sets: boolean[] = Array.isArray(exercise.sets) ? exercise.sets : [];
            return (
              <View key={exerciseIdx} style={workoutStyles.exercise}>
                {/* Exercise header */}
                <View style={workoutStyles.exHead}>
                  <Text style={workoutStyles.exNum}>
                    {String(exerciseIdx + 1).padStart(2, '0')}
                  </Text>
                  <Text style={[workoutStyles.exName, { color: theme.text }]}>
                    {exercise.name}
                  </Text>
                </View>
                <Text style={workoutStyles.exMeta}>
                  {sets.length} × {exercise.reps} · {exercise.rest}s rest
                </Text>

                {/* Set buttons */}
                <View style={workoutStyles.setsRow}>
                  {sets.map((setDone, setIdx) => (
                    <TouchableOpacity
                      key={setIdx}
                      style={[
                        workoutStyles.setBtn,
                        setDone && {
                          backgroundColor: theme.primary + '18',
                          borderColor: theme.primary + '55',
                        },
                      ]}
                      onPress={() => {
                        const actionState: StateMap = {
                          ...state,
                          exerciseIndex: exerciseIdx,
                          setIndex: setIdx,
                          exercise,
                          set: setDone,
                        };
                        const patch = executeActions(c.onSetTap, actionState, onNavigate);
                        if (Object.keys(patch).length > 0) {
                          onStateChange(patch);
                        }
                      }}
                    >
                      <Text style={workoutStyles.setBtnLabel}>Set</Text>
                      <Text
                        style={[
                          workoutStyles.setBtnNum,
                          setDone && { textDecorationLine: 'line-through', color: '#6b7280' },
                        ]}
                      >
                        {setIdx + 1}
                      </Text>
                      {setDone && (
                        <Text style={[workoutStyles.setCheck, { color: theme.primary }]}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      );
    }

    case 'image': {
      const c = component as { type: 'image'; src: string; width?: number; height?: number };
      return (
        <Image
          source={{ uri: c.src }}
          style={[{ width: c.width ?? 200, height: c.height ?? 150 }, customStyle]}
          resizeMode="contain"
        />
      );
    }

    default:
      return null;
  }
}

// Full-page renderer (scroll container).
export function Renderer({ components, state, onStateChange, onNavigate, theme }: RendererProps) {
  const resolvedTheme: ResolvedTheme = {
    primary: theme?.primary ?? '#6366f1',
    background: theme?.background ?? '#ffffff',
    text: theme?.text ?? '#111827',
  };

  function handleAction(actions: TimerAction[]) {
    const patch = executeActions(actions, state, onNavigate);
    if (Object.keys(patch).length > 0) {
      onStateChange(patch);
    }
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: resolvedTheme.background }]}
      contentContainerStyle={styles.content}
    >
      {components.map((comp, i) => (
        <RenderComponent
          key={comp.id ?? i}
          component={comp}
          state={state}
          onAction={handleAction}
          onStateChange={onStateChange}
          onNavigate={onNavigate}
          theme={resolvedTheme}
        />
      ))}
    </ScrollView>
  );
}

// Inline renderer — no scroll wrapper, for overlays / nested use.
export function InlineRenderer({ components, state, onStateChange, onNavigate, theme }: RendererProps) {
  const resolvedTheme: ResolvedTheme = {
    primary: theme?.primary ?? '#6366f1',
    background: theme?.background ?? '#ffffff',
    text: theme?.text ?? '#111827',
  };

  function handleAction(actions: TimerAction[]) {
    const patch = executeActions(actions, state, onNavigate);
    if (Object.keys(patch).length > 0) {
      onStateChange(patch);
    }
  }

  return (
    <>
      {components.map((comp, i) => (
        <RenderComponent
          key={comp.id ?? i}
          component={comp}
          state={state}
          onAction={handleAction}
          onStateChange={onStateChange}
          onNavigate={onNavigate}
          theme={resolvedTheme}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  text: { fontSize: 16, lineHeight: 24 },
  heading: { fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonGhost: {
    borderWidth: 1,
  },
  buttonText: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
  inputWrapper: { gap: 4 },
  inputLabel: { fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  progressWrapper: { gap: 6 },
  progressLabel: { fontSize: 13, fontWeight: '600' },
  progressTrack: {
    height: 3,
    backgroundColor: '#2a2823',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 4 },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  badgeText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center' },
  column: { flexDirection: 'column' },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});

const workoutStyles = StyleSheet.create({
  exercise: {
    paddingBottom: 24,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2823',
  },
  exHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 14,
    marginBottom: 6,
  },
  exNum: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#8a8678',
    fontWeight: '600',
  },
  exName: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    letterSpacing: -0.3,
  },
  exMeta: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#8a8678',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },
  setsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  setBtn: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: '#2a2823',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  setBtnLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#8a8678',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  setBtnNum: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: '600',
    color: '#f4f1ea',
  },
  setCheck: {
    position: 'absolute',
    top: 4,
    right: 6,
    fontSize: 10,
  },
});
