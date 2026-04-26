// Example YAML app: a stopwatch / counter with auto-increment timer

export const EXAMPLE_APP_YAML = `name: Stopwatch
version: "1.0"
initialScreen: main
theme:
  primary: "#6366f1"
  background: "#0f172a"
  text: "#f1f5f9"
`;

export const EXAMPLE_STATE_YAML = `variables:
  - name: seconds
    type: number
    initial: 0
  - name: isRunning
    type: boolean
    initial: false
  - name: laps
    type: array
    initial: []
  - name: label
    type: string
    initial: "Stopwatch"
`;

export const EXAMPLE_TIMERS_YAML = `timers:
  - name: tick
    interval: 1000
    active: "$isRunning"
    actions:
      - type: increment
        variable: seconds
        amount: 1
`;

export const EXAMPLE_SCREENS_YAML = `screens:
  - name: main
    title: "$label"
    layout:
      - type: spacer
        size: 24

      - type: card
        style:
          backgroundColor: "#1e293b"
          borderRadius: 16
        children:
          - type: heading
            value: "$seconds s"
            style:
              textAlign: center
              fontSize: 64
              fontWeight: bold
              color: "#f1f5f9"

          - type: spacer
            size: 8

          - type: progress
            value: "$seconds % 60 * 100 / 60"
            color: "#6366f1"

      - type: spacer
        size: 24

      - type: grid
        columns: 3
        gap: 12
        children:
          - type: button
            span: 2
            label: "$isRunning ? 'Pause' : 'Start'"
            actions:
              - type: setState
                variable: isRunning
                value: "!$isRunning"

          - type: button
            span: 1
            label: Reset
            variant: secondary
            actions:
              - type: setState
                variable: seconds
                value: 0
              - type: setState
                variable: isRunning
                value: false

          - type: button
            span: 3
            label: "Lap →"
            variant: ghost
            disabled: "!$isRunning"
            actions:
              - type: navigate
                screen: laps

      - type: spacer
        size: 24

      - type: input
        variable: label
        label: App Label
        placeholder: "Give your app a name..."

  - name: laps
    title: Laps
    layout:
      - type: spacer
        size: 16

      - type: text
        value: "Current time: $seconds s"
        style:
          textAlign: center
          color: "#94a3b8"

      - type: spacer
        size: 8

      - type: button
        label: Back to Timer
        variant: ghost
        actions:
          - type: navigate
            screen: main
`;
