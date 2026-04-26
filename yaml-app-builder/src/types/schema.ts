// YAML schema types for the app builder

export type StateType = 'number' | 'string' | 'boolean' | 'array' | 'object';

export interface StateVariable {
  name: string;
  type: StateType;
  initial: unknown;
}

export interface StateSchema {
  variables: StateVariable[];
}

export interface TimerAction {
  type: 'setState' | 'navigate' | 'increment' | 'decrement';
  variable?: string;
  value?: string | number | boolean;
  screen?: string;
  amount?: number;
}

export interface Timer {
  name: string;
  interval: number; // milliseconds
  active?: string; // expression like "$isRunning"
  repeat?: boolean; // default true
  actions: TimerAction[];
}

export interface TimerSchema {
  timers: Timer[];
}

export type ComponentType =
  | 'text'
  | 'heading'
  | 'button'
  | 'input'
  | 'image'
  | 'progress'
  | 'spacer'
  | 'row'
  | 'column'
  | 'list'
  | 'card'
  | 'badge'
  | 'divider'
  | 'grid';

export interface ComponentBase {
  type: ComponentType;
  id?: string;
  style?: ComponentStyle;
  visible?: string; // expression like "$count > 0"
  // Grid placement — only meaningful when the component is a direct child of a `grid`
  span?: number; // How many columns this component spans (default 1)
}

export interface ComponentStyle {
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '600' | '700';
  padding?: number;
  margin?: number;
  borderRadius?: number;
  flex?: number;
  textAlign?: 'left' | 'center' | 'right';
  width?: number | string;
  height?: number | string;
  opacity?: number;
}

export interface TextComponent extends ComponentBase {
  type: 'text' | 'heading';
  value: string; // can contain $varName interpolation
}

export interface ButtonComponent extends ComponentBase {
  type: 'button';
  label: string; // can contain expressions
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: string; // expression
  actions: TimerAction[];
}

export interface InputComponent extends ComponentBase {
  type: 'input';
  placeholder?: string;
  variable: string; // state variable to bind to
  inputType?: 'text' | 'number' | 'email';
  label?: string;
}

export interface ImageComponent extends ComponentBase {
  type: 'image';
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ProgressComponent extends ComponentBase {
  type: 'progress';
  value: string; // expression, should resolve to 0-100
  label?: string;
  color?: string;
}

export interface SpacerComponent extends ComponentBase {
  type: 'spacer';
  size?: number;
}

export interface DividerComponent extends ComponentBase {
  type: 'divider';
}

export interface BadgeComponent extends ComponentBase {
  type: 'badge';
  value: string;
  color?: string;
}

export interface ContainerComponent extends ComponentBase {
  type: 'row' | 'column' | 'card';
  children: AnyComponent[];
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
}

export interface ListComponent extends ComponentBase {
  type: 'list';
  items: string; // expression pointing to array state
  template: AnyComponent; // component to render per item, $item = current item
}

// Grid layout: a flex-wrap row divided into `columns` equal tracks.
// Each child's `span` (default 1) determines how many columns it occupies.
export interface GridComponent extends ComponentBase {
  type: 'grid';
  columns: number; // Total number of columns (e.g. 2, 3, 4, 6, 12)
  gap?: number;    // Gap between cells in pixels (default 8)
  children: AnyComponent[];
}

export type AnyComponent =
  | TextComponent
  | ButtonComponent
  | InputComponent
  | ImageComponent
  | ProgressComponent
  | SpacerComponent
  | DividerComponent
  | BadgeComponent
  | ContainerComponent
  | ListComponent
  | GridComponent;

export interface Screen {
  name: string;
  title?: string;
  layout: AnyComponent[];
}

export interface ScreensSchema {
  screens: Screen[];
}

export interface AppSchema {
  name: string;
  version?: string;
  initialScreen: string;
  theme?: {
    primary?: string;
    background?: string;
    text?: string;
  };
}

// The full parsed app bundle
export interface AppBundle {
  app: AppSchema;
  state: StateSchema;
  timers: TimerSchema;
  screens: ScreensSchema;
}

// Runtime state
export type StateMap = Record<string, unknown>;
