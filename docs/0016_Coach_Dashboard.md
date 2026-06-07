### UX/UI Improvements

Lets add an area to be used as a coach dashboard. Here will have a resume of every important info.

## Config

For this spec, use branch CL-0014/UI-UX-Improvments
Always create a plan and present it to me before running the changes

## New feature

1. Add a new route, /coach-dashboard
2. Add the button to go to the new route above the "Team" button
3. This route will contain different areas
4. Area with Coach details

- TOtal wins
- Total loss
- Win ratio
- Total points made
- points/matches
- Add more infos you think it is necessary
- Get these infos from user type

5. Area with unavailable players

- Player injured
- Player with grades below 70

6. Area with Next Match

- Next oponent details (id, nickname, w%, position in league (if yet in regular season) or playoff round (iff in playoffs))

7. Arew with tha last Match

- Last match result and opponent

8. Area with the League standings (only the one the user university is) (if yet in regular season) of its current playoff matchup resume (if in playoffs)

9. Area with stats leader of the team
- Player with best fg%
- Player with best 3pt%
- Player with best steals
- Player with best blocks
- Player with best assists

10. If you think that this page should have any additional info. Present and explain why

## Screen/Taiwlind changes

1. No need

## Fixes

1. No need

## Renaming and refactor

1. Add to type User the data necessary to display the infos in coach dashboard

- Wins, loss, points made
- Update the useSaveGame to also update these infos after a match

## Libraries

1. react-simple-maps
