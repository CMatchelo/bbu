### End of season

When reaching the end of the season, the game should reset some configs for default, create stats and save the previous season.

## Config

For this spec, use branch CL-0008/End Of Season
Always create a plan and present it to me before running the changes

## New Features

1. No need

## Screen/Taiwlind changes

1. In End-Of-Season

- In League CHampions and League Leaders table, Use <Pill> to display the University ID
- This route should take the whole screen, without side menu nor top bar, to avoid player to navigate to any screen other than by clicking "Next season"
- CHange "League champions" title to "Regional Champions"
- Use i18n to also support PT-BR in this screen

## Fixes

1. WHen going to next season, the player should be redirect to team route with DraftTable active

- If you think is better, create a route to display the Draft, instead of displaying inside the route /team

2. When going to create a schedule, sort the teams randomly so that the matches aren't every season in the same order in regional league

3. When creating players or highSChool players, the rand(max by skill rating, 99), is generating a lot of players with high potential.

- The majority should have a potential 75~80, a minor part 81~88 and a really small part, above 88. Fix the formula to make rare players with a high potential

## Renaming and refactor

1. No need

## Libraries

1. No need
