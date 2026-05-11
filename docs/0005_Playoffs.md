### Scouting

## Config

For this spec, use branch CL-0005/Playoffs, already created and active in vscode
Always create a plan and present it to me before running any changes
If any questions, ask before deciding anything

## New feature

1. After week 36, the regional leagues will end and start the national playoffs
2. The first 6 of each league will qualify for playoffs
3. The 2 better 7th place will qualify for playoffs
4. The tie-breaking criteria are in order

- Wins
- Points difference (Points made - points allower)
- Points made
- Random

5. When having the 32 teams selected, the matchup will be by general standings, disregarding the league standings

- 1x32
- 16x17
- 8x25
- 9x24

- 2x31
- 15x18
- 7x26
- 10x23

- 3x30
- 14x19
- 6x27
- 11x22

- 4x29
- 13x20
- 5x28
- 12x21

6. The first matchup may have 3 matches, whoever win 2, won the matchup
7. The second may have ultil 5 matches
8. From the third on, may have until 7

## What to do

1. Create a new type, LeagueStandings

- This type should hold the champion of each regional league, as well as the National Champion
- Create a new file that will save this, that will hold an array of LeagueStandings for each year player

2. Create a new attribute in university type, teamSeasonStandings | null
- teamSeasonStandings will have:
- season: string, regionalStanding: number (1, 2, 3...10), playoffsStanding: (round1, round2... semifinal, 2nd place, champion)
- you can use better names if you think in some

3. After finishing the week36

- Update teamSeasonStandings of all universities
- Create the matches
- Add the matches to schedule

4. In each match, create only the minimum amount necessary

- Round 1 - 2 matches
- Round 2 - 3 matches
- Round 3 - 4 matches

5. Only create the next matches of a matchup ones if necessary
6. Only create each round after ALL the matcheups from the previous one have been resolved
7. After each round ends, update the playoffsStanding of each eliminated team
8. About the games execution, follow exactly as it is today in regular season
  - After the user play its game, simulate the rest.
  - If the user is out of playoffs, in any round, just simulate every match. We'll handle the end of season later

## Screen/Taiwlind changes

1. No need

## Fixes

1. No need

## Renaming and refactor

1. No need


## Libraries

1. No need
