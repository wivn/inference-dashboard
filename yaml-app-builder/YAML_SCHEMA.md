# YAML App Builder — Schema Reference

An app is defined by **four interlinked YAML files**. All `$varName` expressions
reference state variables at runtime.

---

## `app.yaml`

```yaml
name: string          # App display name
version: string       # Optional version
initialScreen: string # Name of the first screen to show
theme:                # Optional theming
  primary: "#6366f1"  # Primary color (buttons, accents)
  background: "#fff"  # Screen background
  text: "#111827"     # Default text color
```

---

## `state.yaml`

Defines all runtime state variables.

```yaml
variables:
  - name: count         # Variable name (referenced as $count)
    type: number        # number | string | boolean | array | object
    initial: 0          # Initial value
  - name: isRunning
    type: boolean
    initial: false
  - name: message
    type: string
    initial: "Hello"
  - name: items
    type: array
    initial: ["a", "b"]
```

---

## `timers.yaml`

Defines background timers that fire on an interval.

```yaml
timers:
  - name: tick
    interval: 1000          # Milliseconds between ticks
    active: "$isRunning"    # Optional boolean expression — timer only fires when true
    actions:
      - type: increment
        variable: count
        amount: 1           # Default 1

      - type: decrement
        variable: count
        amount: 1

      - type: setState
        variable: message
        value: "$count > 10 ? 'High!' : 'Low'"

      - type: navigate
        screen: summary
```

---

## `screens.yaml`

Defines all screens and their component trees.

```yaml
screens:
  - name: main
    title: "My App"     # Optional header title (supports $var interpolation)
    layout:
      - <component>
      - <component>
      ...
```

### Component Types

#### `text`
```yaml
- type: text
  value: "Hello, $name!"    # Supports $var interpolation
  style:
    fontSize: 16
    color: "#333"
    textAlign: center        # left | center | right
```

#### `heading`
```yaml
- type: heading
  value: "Score: $score"
  style:
    fontSize: 32
    fontWeight: bold
```

#### `button`
```yaml
- type: button
  label: "$isRunning ? 'Stop' : 'Start'"
  variant: primary           # primary | secondary | danger | ghost
  disabled: "$count >= 100"  # Optional boolean expression
  actions:
    - type: setState
      variable: isRunning
      value: "!$isRunning"
```

#### `input`
```yaml
- type: input
  variable: userName         # State variable to bind to
  label: "Your Name"         # Optional label above input
  placeholder: "Type here..."
  inputType: text            # text | number | email
```

#### `progress`
```yaml
- type: progress
  value: "$score / 100 * 100"  # Expression → 0–100
  label: "Progress: $score%"
  color: "#10b981"
```

#### `badge`
```yaml
- type: badge
  value: "$count items"
  color: "#6366f1"
```

#### `spacer`
```yaml
- type: spacer
  size: 16    # Height in pixels
```

#### `divider`
```yaml
- type: divider
```

#### `row` / `column` / `card`
```yaml
- type: row          # row | column | card
  gap: 12
  children:
    - type: button
      label: A
      actions: []
    - type: button
      label: B
      actions: []
```

#### `grid`

A flex-wrap grid where you control how many columns exist and how many columns
each child occupies via the `span` property.

```yaml
- type: grid
  columns: 3        # Total number of equal-width columns
  gap: 12           # Gap between cells (pixels)
  children:
    - type: button
      span: 2        # Takes 2/3 of the row width
      label: Wide Button
      actions: []

    - type: button
      span: 1        # Takes 1/3 of the row width
      label: Small
      actions: []

    - type: text
      span: 3        # Full width (3/3)
      value: "Full width text"
```

The `span` property can be set on **any** component when it is a direct child of
a `grid`. Children without `span` default to `1`.

#### `list`
```yaml
- type: list
  items: "$todos"    # Expression pointing to an array state variable
  template:
    type: card
    children:
      - type: text
        value: "$item"   # $item = current list item
```

---

## Actions

Used in `button.actions` and `timer.actions`:

| type | fields | description |
|------|--------|-------------|
| `setState` | `variable`, `value` | Set a state variable. `value` can be an expression. |
| `increment` | `variable`, `amount` | Add `amount` (default 1) to a number variable. |
| `decrement` | `variable`, `amount` | Subtract `amount` (default 1) from a number variable. |
| `navigate` | `screen` | Navigate to a named screen. |

---

## Expressions

- `$varName` — reference a state variable
- `$count + 1` — arithmetic
- `!$isRunning` — boolean negation
- `$count > 0` — comparison (used in `visible`, `disabled`, `active`)
- `"$score / $max * 100"` — formula for progress bars
- `"$isRunning ? 'Running' : 'Stopped'"` — ternary for labels

---

## Visibility

Any component can have a `visible` field:

```yaml
- type: text
  value: "Done!"
  visible: "$count >= 100"
```
