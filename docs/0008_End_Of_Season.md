### End of season

When reaching the end of the season, the game should reset some configs for default, create stats and save the previous season.

## Config

For this spec, use branch CL-0008/End Of Season
Always create a plan and present it to me before running the changes

## What to do

1. Season config

- Add 1 to user.currentSeason (2026 > 2027)
- Reset schedule
  - Create a new one, with new games and currentWeek = 1

2. Players

- All new signedPlayers were highSchoolPlayer type and now are player type
  - Create a <stats> using current year
  - Resent grades to 75
  - Remove any attribute that will not be needed anymore (such as skillsRevealed, playerKnowledge, minSkills)
  - Create any attribute that will now be necessary (such as course, yearsInCollege, yearsToGraduate)
  - Set tutoring to false
  - Compare both types to see what to remove and what to add, if you think that any attribute, to be created, should need any logic, explain and present a plan
- Create new highSchoolPlayers and delete all the old ones.

3. Universities

- Create a new stats.{currentseason} for every university
- Reset every watchlist
- Add all players id, if any, from university.signedPlayers to university.roster
- Remove ALL players that has yearsToGraduate <= 1 from university.roster
- Reset university.signedPlayers

4. If you find any other thing that should be changed or reseted in end of season, say, explain and present a plan

## Screen/Taiwlind changes

1. Add a End Of Season route
2. This page should display

- Champion of each regional league
- Champion of national playoffs
- Player with better number in each of the stats:
  - Points, assists, rebounds, 3pt made, steals

## Fixes

1. No need

## Renaming and refactor

1. No need

## Libraries

1. No need
