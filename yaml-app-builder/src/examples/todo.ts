// Example YAML app: a simple todo list

export const TODO_APP_YAML = `name: Todo List
version: "1.0"
initialScreen: main
theme:
  primary: "#10b981"
  background: "#ffffff"
  text: "#111827"
`;

export const TODO_STATE_YAML = `variables:
  - name: todos
    type: array
    initial:
      - Buy groceries
      - Read a book
      - Go for a walk
  - name: newTodo
    type: string
    initial: ""
  - name: completedCount
    type: number
    initial: 0
`;

export const TODO_TIMERS_YAML = `timers: []
`;

export const TODO_SCREENS_YAML = `screens:
  - name: main
    title: My Todos
    layout:
      - type: row
        gap: 8
        children:
          - type: input
            variable: newTodo
            placeholder: "Add a new todo..."
            style:
              flex: 1
          - type: button
            label: Add
            disabled: "$newTodo === ''"
            actions:
              - type: navigate
                screen: main

      - type: divider

      - type: list
        items: "$todos"
        template:
          type: card
          style:
            backgroundColor: "#f0fdf4"
          children:
            - type: row
              children:
                - type: text
                  value: "• $item"
                  style:
                    flex: 1

      - type: spacer
        size: 16

      - type: badge
        value: "$todos.length todos"
        color: "#10b981"
`;
