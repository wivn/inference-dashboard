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
  ButtonComponent,
  TextComponent,
  InputComponent,
  ProgressComponent,
  ContainerComponent,
  ListComponent,
  BadgeComponent,
  GridComponent,
  TimerAction,
} from '../types/schema';
import { evalExpression, evalBool, evalNumber, resolveStyle } from '../engine/expressions';
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

  // Style values can themselves be expressions (e.g. backgroundColor: "$done ? '#333' : 'transparent'")
  const customStyle = resolveStyle(component.style as Record<string, unknown> | undefined, state);

  switch (component.type) {
    case 'text': {
      const c = component as TextComponent;
      const value = String(evalExpression(c.value, state) ?? '');
      return <Text style={[styles.text, { color: theme.text }, customStyle]}>{value}</Text>;
    }

    case 'heading': {
      const c = component as TextComponent;
      const value = String(evalExpression(c.value, state) ?? '');
      return <Text style={[styles.heading, { color: theme.text }, customStyle]}>{value}</Text>;
    }

    case 'button': {
      const c = component as ButtonComponent;
      const label = String(evalExpression(c.label, state) ?? '');
      const disabled = c.disabled ? evalBool(c.disabled, state) : false;
      const isGhost = c.variant === 'ghost';
      const isDanger = c.variant === 'danger';
      const isSecondary = c.variant === 'secondary';
      const isPrimary = !c.variant || c.variant === 'primary';

      const bgColor = isGhost
        ? 'transparent'
        : isDanger ? '#ef4444'
        : isSecondary ? '#6b7280'
        : isPrimary ? theme.primary
        : 'transparent';

      return (
        <TouchableOpacity
          onPress={() => !disabled && onAction(c.actions)}
          disabled={disabled}
          style={[
            styles.button,
            { backgroundColor: bgColor, opacity: disabled ? 0.4 : 1 },
            isGhost && { ...styles.buttonGhost, borderColor: theme.primary },
            customStyle,
          ]}
        >
          <Text style={[styles.buttonText, isGhost && { color: theme.primary }]}>{label}</Text>
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
              const newVal =
                c.inputType === 'number' ? (isNaN(Number(text)) ? text : Number(text)) : text;
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
            <View
              style={[
                styles.progressFill,
                { width: `${pct}%` as unknown as number, backgroundColor: color },
              ]}
            />
          </View>
        </View>
      );
    }

    case 'spacer':
      return <View style={{ height: (component as { size?: number }).size ?? 16 }} />;

    case 'divider':
      return <View style={[styles.divider, customStyle]} />;

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
      return (
        <View
          style={[
            c.type === 'row' ? styles.row : styles.column,
            c.type === 'card' && styles.card,
            c.gap != null ? { gap: c.gap } : undefined,
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
      const as = c.as ?? 'item';
      // Resolve the items array — supports dot-path: "$exercise.sets"
      const itemsExpr = c.items.replace(/^\$/, '');
      const rawItems = evalExpression(`$${itemsExpr}`, state);
      const items = Array.isArray(rawItems) ? rawItems : [];

      if (c.horizontal) {
        return (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.hListContent, c.gap != null ? { gap: c.gap } : undefined]}
            style={customStyle}
          >
            {items.map((item, index) => (
              <RenderComponent
                key={index}
                component={c.template}
                state={{ ...state, [as]: item, [`${as}Index`]: index }}
                onAction={onAction}
                onStateChange={onStateChange}
                onNavigate={onNavigate}
                theme={theme}
              />
            ))}
          </ScrollView>
        );
      }

      return (
        <FlatList
          data={items}
          keyExtractor={(_, i) => String(i)}
          scrollEnabled={false}
          style={customStyle as object}
          renderItem={({ item, index }) => (
            <RenderComponent
              component={c.template}
              state={{ ...state, [as]: item, [`${as}Index`]: index }}
              onAction={onAction}
              onStateChange={onStateChange}
              onNavigate={onNavigate}
              theme={theme}
            />
          )}
        />
      );
    }

    case 'grid': {
      const c = component as GridComponent;
      const columns = c.columns ?? 2;
      const gap = c.gap ?? 8;
      return (
        <View style={[{ flexDirection: 'row', flexWrap: 'wrap', margin: -(gap / 2) }, customStyle]}>
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

// Full-page renderer (ScrollView wrapper).
export function Renderer({ components, state, onStateChange, onNavigate, theme }: RendererProps) {
  const resolvedTheme = resolveTheme(theme);

  function handleAction(actions: TimerAction[]) {
    const patch = executeActions(actions, state, onNavigate);
    if (Object.keys(patch).length > 0) onStateChange(patch);
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

// Inline renderer — no scroll wrapper (used for overlays).
export function InlineRenderer({ components, state, onStateChange, onNavigate, theme }: RendererProps) {
  const resolvedTheme = resolveTheme(theme);

  function handleAction(actions: TimerAction[]) {
    const patch = executeActions(actions, state, onNavigate);
    if (Object.keys(patch).length > 0) onStateChange(patch);
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

function resolveTheme(theme?: { primary?: string; background?: string; text?: string }): ResolvedTheme {
  return {
    primary: theme?.primary ?? '#6366f1',
    background: theme?.background ?? '#ffffff',
    text: theme?.text ?? '#111827',
  };
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
  buttonGhost: { borderWidth: 1 },
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
  progressTrack: { height: 3, backgroundColor: '#2a2823', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 4 },
  badge: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
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
  hListContent: { flexDirection: 'row', alignItems: 'center' },
});
