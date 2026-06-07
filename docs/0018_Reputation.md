### Model Specs

1. The game will now change the users reputation after each game
2. Read and present a plan first before implementing anything
3. WHen coding, use the already active branch CL-0018/Reputation

## New feature

1. After each match, add ou remove points from user.reputation
2. If its a win, add

- Calculate a small number to add, considering the win result(by a large differente means more reputation gain, a tigh result means less repuration gain)
- Use also some random number

3. If its a lose, remove
- Calculate a small number to add, considering the lost result (by a large differente means more reputation lost, a tigh result means less repuration lost)
- Use also some random number

4. The max reputation is 100, the min is 0

5. As higher is the reputation, less should increase in a win.

- Ex: Reputation 10, win by 20, gain 5 points
- EX2: Reputation 90, win by 20, gain 1.5 point
- The numbers are just a example, do not consider to create the formula

## Screen/Taiwlind changes

1. No need

## Fixes

1. No need

## Renaming and refactor

1. No need


## Libraries

1. No need
