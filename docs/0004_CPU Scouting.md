### Scouting

## Config

For this spec, use branch CL-0002, already created and active in vs-code
Always create a plan and present it to me before running any changes
If any questions, ask before deciding anythink

## Feature / Problem

1. Lets add CPU functionalities in scouting

## What to do

1. Add to highSchollPlayer type an attribute signedWith: string | null
2. Add to university type an attribute watchlist: string[]
3. Change the scholarshipOffers name to universityInterest, that will now be an array of universities that have interest in that player
4. Every player that the user has playerKnowledgle > 30, should have the user.currentUniversity.id on its array of universityInterest
5. Every 4 weeks/games, each CPU University will add 2 players to its list

- To know what type of player add to list:
  - For each position:
    needScore = playersWithYearsToGraduate1 - playersInWatchlistByPosition
  - Sort positions by needScore DESC
  - Ignore positions where needScore <= 0
  - Find positions with highest needScore
  - Randomly pick ONE of these positions
  - From that position:
    - select 2 random players (that are valid)
- Add that university id to player.universityInterest
- Add that player id id to university.watchlist
- Only consider players where signedWith === null
- A university cannot scout the same player twice

6. Every 10 weeks/games, each CPU University will attempt to sign players

- To calculate how many player each 10 games, count how many current players has yearsToGraduate === 1, and divide by 3, and floor() the result
  - EX - The uni has 8 players with yearsToGraduate === 1
  - 8/3.floor() = 2
  - Every 10 games, this uni will attempt to sign to 2 players
- Only consider players in university.watchlist
- Only consider players where signedWith === null
- Prioritize players with higher potential

7. WHen receiveng a offer to sign, to a player decide if signs with that university or no, consider

- Process attempts sequentially
- For each university in player.universityInterest:
  score = university.academicPrestige + (player.tutoring ? bonus : 0) + (player.knowledge / 10)
  finalScore = score * random(0.85 - 1.15)
  - If university is user-controlled:
    add extra bonus
- Player signs with the university with highest score

8. when player sign

- set player.signedWith
- Once player.signedWith is set, ignore further attempts
- add player to university roster
- remove player from all universities.watchlist
- clear player.universityInterest
- Process signing attempts sequentially per player
