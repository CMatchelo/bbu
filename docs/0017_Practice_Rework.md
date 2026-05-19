### UX/UI Improvements

Lets rework the Practice and Team Practice layout, UX and UI

## Config

For this spec, use branch CL-0014/UI-UX-Improvments
Always create a plan and present it to me before running the changes

## New feature

1. Add a skillsStartSeason: skills to type Player.
- Every season start, this attribute will receive the current skills values of that player to be used to check the player evolution in that season

## Screen/Taiwlind changes

1. Display now only 1 player per line
2. Skill Pill Grid (replace `<select>`)
- Replace the dropdown with an inline grid of small clickable chips — one per skill — each showing the skill abbreviation and its current value. The currently selected skill is highlighted in `highlights1`. This makes selection tactile and lets the coach compare all 10 skill levels at a glance instead of opening a dropdown blind.

3. Pending-change row highlight
- Rows where the practice pick has changed but not yet been saved get a subtle left border or row tint. This makes the Save button feel necessary and shows the scope of pending changes at a glance.

4. Skill bar on focused skill
- Next to the selected skill chip, render a small horizontal bar (0–1 scale) showing how developed the next skill point already is. 
- If a player have 85.5, the bar should be half full (0.5)
- Display the skill value .toFloor()

5. Player evolution
- Next to each current skill value, display, in a smaller font, the skill value in the beggining of the season from skillsStartSeason
- Only display if the player have already gain at least 1 point in that skill in that season

## Fixes

1. No need

## Renaming and refactor

1. No need

## Libraries

1. No need
