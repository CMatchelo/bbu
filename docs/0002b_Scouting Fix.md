### Scouting

## Config

For this spec, use branch CL-0002, already created and active in vs-code
Always create a plan and present it to me before running any changes
If any questions, ask before deciding anythink

## Feature / Problem

1. Since we have an range of skills when creating players, makes no sense for them min and max skills when scouting go from 0 to 99. Lets change this
2. The scouting system should gradually reduce uncertainty about a player.
3. The player should never feel completely random or fully predictable.

## What to do

1. Create the highSchoolPlayer as it is
2. Create a skillsRevealed attribute, that will have all the skills as boolean.
- If true, the user will see the range of that attribute in table
- If false, the user will see a ? in table
3. For each 10 points of playerKnowledge gained, another random skill range is revealed
- Change the skill.isRevealed for true
4. When reaching 100 points, all the skills will be reveiled.
5. Each game, each player being scouted gains +10 of playerKnowledge
6. Use essa função para calcular os maxSkill e minSkill
const knowledgeFactor = playerKnowledge / 100 
const maxRange = rand(17, 23) 
const baseRange = maxRange * (1 - knowledgeFactor) 
const rangeVariance = baseRange * randomFloat(0.8, 1.2) 
const centerOffset = randomBetween(-rangeVariance * 0.3, rangeVariance * 0.3) 
const estimatedCenter = realSkill + centerOffset 

let min = estimatedCenter - rangeVariance / 2 
let max = estimatedCenter + rangeVariance / 2

min = Math.floor(min) 
max = Math.ceil(max)





