// Example YAML app: Push / Pull workout tracker

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
                  value: "REST"
                  style:
                    fontSize: 10
                    color: "#0a0a08"
                    opacity: 0.7
                - type: heading
                  value: "timeFormat($timerSeconds)"
                  style:
                    fontSize: 40
                    color: "#0a0a08"
                    fontWeight: bold

            - type: button
              label: "+30s"
              variant: ghost
              style:
                borderColor: "rgba(0,0,0,0.2)"
              actions:
                - type: increment
                  variable: timerSeconds
                  amount: 30

            - type: button
              label: "Skip"
              variant: ghost
              style:
                borderColor: "rgba(0,0,0,0.2)"
              actions:
                - type: setState
                  variable: timerActive
                  value: false

    layout:
      - type: column
        gap: 4
        style:
          paddingBottom: 12
          borderBottomWidth: 1
          borderBottomColor: "#2a2823"
        children:
          - type: text
            value: "Solo Day"
            style:
              fontSize: 11
              color: "#8a8678"

          - type: heading
            value: "Push / Pull"
            style:
              fontSize: 48
              fontWeight: bold
              letterSpacing: -2

          - type: progress
            value: "$completedSets / $totalSets * 100"
            color: "#d4ff3a"
            label: "$completedSets / $totalSets sets"

      - type: spacer
        size: 20

      - type: workout
        exercises: "$exercises"
        onSetTap:
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
