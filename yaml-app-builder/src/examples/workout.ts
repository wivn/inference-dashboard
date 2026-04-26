// Push / Pull workout tracker — uses only composable list + grid primitives.
// Demonstrates: nested lists with `as` naming, dot-path expressions,
// dynamic styles, toggleNestedItem action, and screen overlay.

export const WORKOUT_APP_YAML = `name: Push / Pull
version: "1.0"
initialScreen: main
theme:
  primary: "#d4ff3a"
  background: "#0e0e0c"
  text: "#f4f1ea"
`;

export const WORKOUT_STATE_YAML = `variables:
  - name: exercises
    type: array
    initial:
      - name: "Chest Press Machine"
        reps: "8–12"
        rest: 90
        sets: [false, false, false]
      - name: "Seated Row Machine"
        reps: "8–12"
        rest: 90
        sets: [false, false, false]
      - name: "Lat Pulldown Machine"
        reps: "8–12"
        rest: 90
        sets: [false, false, false]
      - name: "Shoulder Press Machine"
        reps: "8–12"
        rest: 90
        sets: [false, false, false]
      - name: "Rear Delt Machine"
        reps: "12–15"
        rest: 60
        sets: [false, false, false]
      - name: "Lateral Raises"
        reps: "12–15"
        rest: 60
        sets: [false, false, false]
      - name: "Biceps Curl"
        reps: "10–12"
        rest: 60
        sets: [false, false]
      - name: "Triceps Pushdown"
        reps: "10–12"
        rest: 60
        sets: [false, false]

  - name: completedSets
    type: number
    initial: 0

  - name: totalSets
    type: number
    initial: 22

  - name: timerSeconds
    type: number
    initial: 0

  - name: timerActive
    type: boolean
    initial: false
`;

export const WORKOUT_TIMERS_YAML = `timers:
  - name: restCountdown
    interval: 1000
    active: "$timerActive"
    actions:
      - type: decrement
        variable: timerSeconds
        amount: 1
      - type: setState
        variable: timerActive
        value: "$timerSeconds > 0"
`;

export const WORKOUT_SCREENS_YAML = `screens:
  - name: main
    overlay:
      visible: "$timerActive"
      backgroundColor: "#d4ff3a"
      children:
        - type: row
          gap: 12
          children:
            - type: column
              gap: 2
              style:
                flex: 1
              children:
                - type: text
                  value: REST
                  style:
                    fontSize: 10
                    color: "#0a0a08"
                    opacity: 0.6
                - type: heading
                  value: "timeFormat($timerSeconds)"
                  style:
                    fontSize: 40
                    fontWeight: bold
                    color: "#0a0a08"
            - type: button
              label: +30s
              variant: ghost
              style:
                borderColor: "rgba(0,0,0,0.2)"
                borderWidth: 1
              actions:
                - type: increment
                  variable: timerSeconds
                  amount: 30
            - type: button
              label: Skip
              variant: ghost
              style:
                borderColor: "rgba(0,0,0,0.2)"
                borderWidth: 1
              actions:
                - type: setState
                  variable: timerActive
                  value: false

    layout:
      # ── Header ──────────────────────────────────────────────
      - type: column
        gap: 8
        style:
          paddingBottom: 20
          borderBottomWidth: 1
          borderBottomColor: "#2a2823"
          marginBottom: 4
        children:
          - type: text
            value: Solo Day
            style:
              fontSize: 11
              color: "#8a8678"
              fontWeight: "600"

          - type: heading
            value: "Push / Pull"
            style:
              fontSize: 48
              fontWeight: bold
              letterSpacing: -2
              lineHeight: 48

          - type: progress
            value: "$completedSets / $totalSets * 100"
            color: "#d4ff3a"
            label: "$completedSets / $totalSets sets"

      # ── Exercise list ────────────────────────────────────────
      # Outer list: one item per exercise.
      # Inner list: one button per set, as: "set" so $set / $setIndex
      # don't shadow $exercise / $exerciseIndex from the outer loop.
      - type: list
        items: "$exercises"
        as: exercise
        template:
          type: column
          gap: 12
          style:
            paddingTop: 20
            paddingBottom: 20
            borderBottomWidth: 1
            borderBottomColor: "#2a2823"
          children:
            # Exercise header row
            - type: row
              gap: 14
              children:
                - type: text
                  value: "$exerciseIndex + 1"
                  style:
                    fontFamily: monospace
                    fontSize: 13
                    color: "#8a8678"
                    fontWeight: "600"
                    minWidth: 24
                - type: text
                  value: "$exercise.name"
                  style:
                    fontSize: 20
                    fontWeight: "600"
                    flex: 1
                    letterSpacing: -0.3

            # Meta line
            - type: text
              value: "$exercise.reps · $exercise.rest s rest"
              style:
                fontSize: 11
                color: "#8a8678"
                fontWeight: "600"

            # Set buttons — inner list over $exercise.sets
            - type: list
              items: "$exercise.sets"
              as: set
              horizontal: true
              gap: 10
              template:
                type: button
                label: "$set ? '✓' : $setIndex + 1"
                style:
                  width: 64
                  height: 64
                  borderRadius: 14
                  borderWidth: 1
                  borderColor: "$set ? '#d4ff3a55' : '#2a2823'"
                  backgroundColor: "$set ? '#d4ff3a14' : 'transparent'"
                  paddingVertical: 0
                  paddingHorizontal: 0
                  alignItems: center
                  justifyContent: center
                actions:
                  - type: toggleNestedItem
                    variable: exercises
                    outerIndex: "$exerciseIndex"
                    innerField: sets
                    innerIndex: "$setIndex"
                  - type: setState
                    variable: completedSets
                    value: "$completedSets + ($set ? -1 : 1)"
                  - type: setState
                    variable: timerSeconds
                    value: "$exercise.rest"
                  - type: setState
                    variable: timerActive
                    value: "!$set"
`;
