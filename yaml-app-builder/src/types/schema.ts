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
  type:
    | 'setState'
    | 'navigate'
    | 'increment'
    | 'decrement'
    | 'toggleItemField'    // toggle a boolean field on array[index]
    | 'setItemField'       // set a field on array[index]
    | 'toggleNestedItem';  // toggle a field in array[outerIndex].innerField[innerIndex]
  variable?: string;
  value?: string | number | boolean;
  screen?: string;
  amount?: number;
  // toggleItemField / setItemField
  index?: string | number;
  field?: string;
  // toggleNestedItem
  outerIndex?: string | number;
  innerField?: string;
  innerIndex?: string | number;
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
  span?: number;    // grid column span (only meaningful inside a `grid`)
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
  value: string; // supports $var interpolation and timeFormat($var)
}

export interface ButtonComponent extends ComponentBase {
  type: 'button';
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: string; // expression
  actions: TimerAction[];
}

export interface InputComponent extends ComponentBase {
  type: 'input';
  placeholder?: string;
  variable: string;
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
  value: string; // expression → 0–100
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
  items: string;        // expression pointing to an array — supports dot-paths: "$exercise.sets"
  as?: string;          // name for the loop variable (default "item"); generates $<as> and $<as>Index
  horizontal?: boolean; // render as a horizontal scroll row (default false)
  gap?: number;         // gap between items when horizontal (default 0)
  template: AnyComponent;
  // Inside the template:
  //   $<as>      — current item (default $item)
  //   $<as>Index — current index (default $itemIndex)
  //   Outer loop variables stay in scope — nested lists don't shadow each other
  //   when each level uses a different `as` name.
}

export interface GridComponent extends ComponentBase {
  type: 'grid';
  columns: number;
  gap?: number;
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

// A screen-level overlay rendered above the scroll content (e.g. rest timer).
export interface ScreenOverlay {
  visible?: string; // expression — overlay shows when true
  children: AnyComponent[];
  backgroundColor?: string; // default accent/primary
  position?: 'bottom' | 'top'; // default 'bottom'
}

export interface Screen {
  name: string;
  title?: string;
  layout: AnyComponent[];
  overlay?: ScreenOverlay;
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

export interface AppBundle {
  app: AppSchema;
  state: StateSchema;
  timers: TimerSchema;
  screens: ScreensSchema;
}

export type StateMap = Record<string, unknown>;
