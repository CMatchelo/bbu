### Scouting

## Config

For this spec, use branch CL-0002, already created and active in vs-code
Always create a plan and present it to me before running any changes
If any questions, ask before deciding anythink

## Feature / Problem

1. When starting a new season, the game should generate 500 players. These players will represent the "high school" players that are being scouted this season and can be called to a university next season.
2. The players should have high school age
3. The universities will scout the players and sign for the next season.
4. Each university can scout up to 3 players at the same time.
5. Each university can offer up to 4 Scholarships at the same time (couting the players already in the team)
6. The user will not be able to see all the players skills values before scouting

## What to do

1. Create a new type, highSchoolPlayer

- This type will be just like Player.ts, but
  - Remove yearsInCollege, yearsToGraduate, course, currentUniversity, stamina, injured, injury, available, practicing, stats
  - Change scholarship to scholarshipOffers, that will be an array of universities IDs that already offered an scholarship to that player
  - Add a scouted, that will be a boolean representing if the user is scouting that player
  - Add a playerKnowledge, that will represent how much of that player the User already know, it goes from 1 to 99
  - Add 2 atributes of type Skill, maxSkills and minSkills, this will represent the range of the real skil value the user already know about that player
    - There is, in 5. an calculus to use to calculate
  - minPotential and maxPotential follows the same rules as minSkills and maxSkills

2. Create 250 players, 50 in each position, and save in highSchoolPLayer.json and save a Record<id, player> with all players
- Update the slice, by having setAllPlayers, updatePlayers, getAllHighSchoolPlayers
- Update the backend as necessary

3. Create a new page scouted (there ir already a item in sideMenu to it, fix the route) displaying 2 tables
- Table Skills (displaying MIN-MAX, never de real SKILL value)
  - If possible, use the already existing SkillsTable, but as this table show the real Skill value, if necessary, create a new table
- Table Scouting
  - Scout (check box), Position, Name, scholarshipOffers, playerKnowledge, grades, scout tutoring (check box) and a EN-Letter of Commitment, PT-Carta de Compromisso (button)
    - A Letter button of a player should disable if he already signed with any university
    - All Letter butons should disable if player already sign with (the size of its current roster that has 1 as yearsToGraduate)
      - If the user has 4 players with 1 yearToGraduate, he can sign with only 4 players to next year.
    - When signing a player, add its ID to the array university.signedPlayers (create this attribute in university type)
- All the check box and buttons, for now, do nothing. We will develop this later. Just console.log("Function called)"

4. If a player is being scouted by the user

- playerKnowledge should go up by 5 points each game
- Update the minSkills and maxSkills, minPotential and maxPotential using the new playerKnowledge value
- Calculate the new range using the infos
  - The new min should never be smaller then the previous one
  - The new max should never be greater then the previous one.
  - The playerKnowledg goes up 5 by 5, so that makes 20 levels.

5. Idea of cauclus to calculate min and max skills
const knowledgeFactor = playerKnowledge / 100

const baseError = randomBetween(25, 60)
const error = baseError * (1 - knowledgeFactor)

const centerOffset = randomBetween(-error * 0.5, error * 0.5)
const estimatedCenter = realSkill + centerOffset

const min = estimatedCenter - randomBetween(0.6, 1.2) * error
const max = estimatedCenter + randomBetween(0.6, 1.2) * error
