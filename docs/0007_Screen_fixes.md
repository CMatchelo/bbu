### Scouting

1. We should fix some style bugs

## Config

For this spec, use branch CL-0005/Playoffs, already created and active in vscode
Always create a plan and present it to me before running any changes
If any questions, ask before deciding anything

## What to do

1. Add speed options so the player can choose

- Fast - 0.33s
- Normal - 0.5s
- Slow - 1s

2. Under the "Dev" section in sideMenu, add an button that will simulate every match (even the ones with the user) until the week 35.

- Use the simulateMatchWithoutPlayer with an aditional parameter that checks if userMatches should be simulated or not

## Screen/Taiwlind changes

1. In /teamSelection, add in top of it, the next match that the user is going to play

- (position in league) ID nickname x nickname ID (position in league)

2. Do you see any aditional information that could fit in this screen?
3. In Recruiting Board, display "Overall" only when the playerKnowlege > 100, until then, display "?"
4. In "Education" table in /team, add a colum "Course", and add the Major that the player is graduating

## Fixes

1. No need

## Renaming and refactor

1. No need

## Libraries

1. No need
