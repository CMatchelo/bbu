### Scouting

## Config

For this spec, use branch CL-0002, already created and active in vs-code
Always create a plan and present it to me before running any changes
If any questions, ask before deciding anythink

## Feature / Problem

1. Lets add functionalities in scouting

## What to do

1. In /stats, the table is rendered inside a virtual dom. Do the same for the tables in scout. With the same height
2. Above the table, create a "Confirm changes" button
3. When the user check or uncheck scout box, save the changes in a local list

- Max of 2 players being scout at the same time
- +10 of playerKnowledge for every player being scouted

4. When the user check or uncheck tutoring box, save the changes in a local list

- Max of 2 players being tutored at the same time
- There is a CalculateGrades function in educationFunction. Run for every player in highSchoolPlayers after each game
- Save the highSchoolPLayers in file after each game

5. When the user clicks the Confirm Changes button, dispatch the changes and save them in a file
6. "Send letter" button should be enabled only if playerKnowledge >= 50.

- This button will still do nothing for now

7. The potential should appear only if playerKnowledge == 100
