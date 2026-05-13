### Team Practice

Create a Practice System focused on team playbook familiarity.

## Config

For this spec, use branch CL-0010/Team Practice
Always create a plan and present it to me before running the changes

## New feature

1. Create the types Offensive and Defensive Playtype

- As worldwide known, the playtypes can be written only in english
- OffensivePlaytypes (Record<id, {familiarity, pracitincPoints}>)
  - Pick & Roll
  - Motion
  - Isolation
  - 5-Out
  - Post-Up
  - Fast Break

- DeffensivePlaytypes (Record<id, {familiarity, pracitincPoints}>)
  - Man-to-Man
  - Zone
  - Perimeter Pressure
  - Full Court Press
  - Switch Everything
  - Packed Paint

2. ADd to type university offensive and defensive play systems, that will be a the type created is step 1

- offensive: {
  PickAndRoll: { familiarity: 40, practicingPoints: 3},
  Motion: : { familiarity: 56, practicingPoints: 5},
  ...
  }
- same for defense play types

4. Create a new route /teamPractice

- Team System (US)
- Sistema Tático (PT)

5. This new route should have a table for offensive and defensive playtypes.

- Each table have 10 points to be distribute among playtypes (10 def and 10 ofe)
- Min of 0, Max of 5 in each play type
- When all 10 points are distributed, do not allow anymore points to be used
- To display the number of points remaining, use the same UI that is used to select the quantity of Players are selected for the team
  - C:\Users\cmatc\OneDrive\Documents\pp\bbu\src\pages\team-selection\components\PlayersSelection.tsx
  - TRansform it in a component on its own file, if necessary
- A button to "Save practice"
  After clicking, it should save the practicingPoints of the user university

6. After each game, the user university playtype familiarity should update acording to the following values, always respecting MAX and MIN

- 0 practicingPoints = -4 familiarity
- 1 practicingPoints = -2 familiarity
- 2 practicingPoints = maintain
- 3 practicingPoints = +1 familiarity
- 4 practicingPoints = +2 familiarity
- 5 practicingPoints = +3 familiarity

## Screen/Taiwlind changes

1. No need

## Fixes

1. No need

## Renaming and refactor

1. Change the "practice" route

- /PlayerDevelopment
  - Player Development (EN)
  - Desenvolvimento (PT)

## Libraries

1. No need
