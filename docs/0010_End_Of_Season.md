### End of season

## Config
For this spec, use branch CL-0002
Always create a plan and present it to me before running the changes

## Feature / Problem
When reaching the end of the season, the game should reset some configs for default, create stats and save the previous season.

## What to do
1. At the botton of side menu, add a "End season" button
- This is temporary so we dont need to go all the way to the end of the season to simulate.
2. In user, that can be found in useUser()
  - Add 1 to user.currentSeason
  - Change user.is
3. Set schedule.currentWeek to 1
4. Remove ALL players that has yearsToGraduate <= 1 from university rosters 
5. Create a new stats.{currentseason} for every university
6. Create a new stats.{currentseason} for every player