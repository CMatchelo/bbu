### Scouting

## Config

For this spec, use branch CL-0002, already created and active in vs-code
Always create a plan and present it to me before running any changes
If any questions, ask before deciding anythink

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

2. Create two new attributes in university type
- 

2. Add to TeamSeasonStats a positionEnded = string | null

1. After finishing the week36

- Create the matches
- Add to

2. In each match, create only the minimum amount necessary

- Round 1 - 2 matches
- Round 2 - 3 matches
- Round 3 - 4 matches

3. Only create the next matches of a matchup ones if necessary
4. Only create each round after ALL the matcheups from the previous one have been resolved

## Screen/Taiwlind changes

1. No need

## Fixes

1. No need

## Renaming and refactor

1. No need


## Libraries

1. No need
