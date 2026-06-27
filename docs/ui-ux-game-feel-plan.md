# UI/UX Game Feel Improvement Plan

This document outlines ideas to make UniBasket Brasil feel more like a game and less like an Excel spreadsheet. The focus is on new content, new display paradigms, and narrative momentum — not just visual polish.

---

## The Core Problem

Almost every screen is a data table, and the player's job feels like "manage rows in a spreadsheet" rather than "coach a team." The game has great depth, but it is all hidden behind columns of numbers. The improvements below address three root causes:

1. **No spatial metaphors** — real basketball is played on a court, but nothing in the UI reflects that.
2. **No narrative momentum** — there is no "home base" that tells you what matters right now, and matches begin and end without ceremony.
3. **Players feel like rows, not people** — rosters are tables of numbers; players have no identity beyond their stats.

---

## Improvement Areas

### 1. Replace Tables with Spatial/Visual Metaphors

#### Court Lineup Builder
Replace the current starter-selection table in Team Selection with a half-court diagram. Show 5 drag-and-drop slots in their actual positions (PG at the top, C at the paint, wings on the sides). This is the one interaction in the game that already has a direct spatial real-world equivalent.

---

### 3. Make Matches Feel Like Events

The live simulation is already the strongest game-feel element. The problem is the **before and after**.

#### Pre-Match Hype Screen
A brief full-screen moment before simulation starts: opponent name, your current record, a "home" or "rivalry" tag if applicable. Even 5 seconds of this reframes the match as an event, not just a button click.

#### Post-Match Recap Screen
After a game ends, instead of returning directly to the calendar table, show a recap:

- Final score (large, hero-style)
- Top performer: e.g., "João — 24 pts, 8 reb"
- One-line narrative: e.g., "Road win keeps you in playoff contention"
- Buttons: View Full Stats / Continue

All data needed for this already exists in match results and player stats.

---

### 4. Player Cards and Archetypes

#### Player Card View
Offer a card view as an alternative to the skills table. Each card would show:

- A generated silhouette avatar by position
- A circular overall rating (large, prominent)
- Role archetype label (see below)
- 3 highlighted stats

#### Player Archetypes
Assign a label based on skill distribution. These do not need to affect gameplay — they give players identity at a glance.

| Archetype | Skill Profile |
|---|---|
| Floor General | High PAS + DRI, average elsewhere |
| Sharpshooter | High 3PT, low REB/BLK |
| Slasher | High LAY + AGL, moderate 3PT |
| Two-Way Wing | Balanced DEF + STL + decent offense |
| Rim Protector | High BLK + REB, low perimeter skills |
| Paint Scorer | High 2PT + REB, low 3PT |

---

### 5. In-Game News Feed / League Pulse

A weekly **news feed** showing events from around the league would make the world feel alive:

- "State University upset the #1 seed on the road"
- "Top recruit commits to rival school"
- "Star player suffers season-ending knee injury"
- "Your team's winning streak reaches 5 games"

This requires a new system to generate narrative events from existing game data (standings changes, injuries, results). The player only sees what happens in their own games today — the news feed adds ambient drama without requiring them to dig into tables.

---

### 6. Visual Player Development Progress

The Player Development page lets you pick a skill to train but gives no visual feedback on growth. Adding the following would make development feel rewarding:

- **Growth sparkline** — a tiny trend line per skill showing the last 5 weeks
- **Season delta** — "↑ 6 pts this season" next to each skill bar
- **Milestone indicator** — a subtle highlight when a skill crosses a threshold (e.g., crosses 70 for the first time)

Facility upgrades could also show a **progress bar toward the next level** instead of just static level pips.

---

## Libraries

The project already uses React 19, Redux Toolkit, Tailwind CSS 4, TanStack Virtual, Howler.js, i18next, and Electron. The recommendations below only cover new dependencies.

---

### `@dnd-kit/core` + `@dnd-kit/sortable`

**Used in:** Court Lineup Builder

The most actively maintained drag-and-drop library for React. It is headless (no imposed styles), works well with Tailwind, and has built-in accessibility support. Two packages are needed:

- `@dnd-kit/core` — the drag engine (sensors, collision detection, context)
- `@dnd-kit/sortable` — the sortable preset, used for reordering items within a list or between columns

**Court Lineup Builder:** Each player bench slot becomes a draggable item; the 5 court position slots become drop targets. Collision detection determines which slot a player was dropped into.


```
npm install @dnd-kit/core @dnd-kit/sortable
```

---

### `framer-motion`

**Used in:** Pre-Match Hype Screen, Post-Match Recap Screen, Player Cards, News Feed

The standard animation library for React. It handles mount/unmount animations (`AnimatePresence`), gesture-based interactions, and layout transitions — all things that make screens feel like game moments rather than page loads.

- **Pre-Match Hype Screen:** Animate the opponent name and team records sliding in, then fade to the game screen.
- **Post-Match Recap:** Animate the final score counting up, the top performer card sliding in from below.
- **Player Cards:** Card flip or scale-in animation when switching from table to card view.
- **News Feed:** Each news item slides in from the side and fades out after being read.

```
npm install framer-motion
```

---

### `recharts`

**Used in:** Development Sparklines, Coach's Dashboard mini-charts

A composable chart library built on D3 and SVG, designed specifically for React. It exposes individual chart elements as components, which makes embedding a tiny sparkline inside a table row or a card straightforward without fighting the library's layout system.

- **Development Sparklines:** Use `<LineChart>` with minimal config (no axes, no legend) to render a small trend line per skill on the Player Development page.
- **Coach's Dashboard:** Use `<AreaChart>` or `<BarChart>` for a compact "last 5 games" points trend in the dashboard hub.
- **Facility progress:** Use `<RadialBarChart>` or a simple `<ProgressBar>` equivalent for upgrade progress visualization.

```
npm install recharts
```

---

### 9. Team Play System — `/team-practice`

This is already the best-designed page in the game (dot pool, familiarity bars, +/− controls). The gaps are about scannability and context.

#### Highlight allocated rows
Rows where `practicingPoints > 0` get a subtle left accent border in the section's color (`highlights1` for offense, `highlights2` for defense). Zero-point rows recede visually. The coach's weekly allocation becomes immediately scannable without adding any numbers.

#### Average familiarity summary in header
Next to the 10-dot point pool, show the mean familiarity across all plays in that section (e.g., `avg fam: 34`). This gives the coach a single-glance metric for how developed their play system is over the course of a season.

#### Play descriptions (tooltip or subtext)
Add a one-line tactical description to each play entry — either as a hover tooltip or visible subtext in a muted color. Example: *"High ball-handler isolation — rewards individual offensive skill."* This makes coaching decisions feel meaningful rather than arbitrary.

---

## Library Summary

| Library | Features Used | Improvements |
|---|---|---|
| `@dnd-kit/core` + `@dnd-kit/sortable` | Drag and drop, sortable lists, column transfer | Court Lineup Builder, Recruiting Kanban |
| `framer-motion` | Mount/unmount animations, layout transitions, gestures | Pre-Match Hype, Post-Match Recap, Player Cards, News Feed |
| `recharts` | Sparklines, area/bar charts, radial bars | Development Sparklines, Dashboard charts |
| `react-simple-maps` | SVG map from GeoJSON/TopoJSON | League Map of Brazil |
| Custom SVG/HTML | — | Playoff Bracket, Season Timeline |

---

## Priority Summary

| Change | Game-Feel Impact | Content Required |
|---|---|---|
| Coach's Dashboard | High | Aggregate existing data |
| Court lineup builder | High | New visual component |
| Post-match recap screen | High | Derive from existing match/player data |
| Playoff bracket diagram | Medium | Remap existing data |
| Recruiting Kanban board | Medium | Restructure existing screens |
| Player card view + archetypes | Medium | Add archetype classification logic |
| League news feed | Medium | New event generation system |
| League map of Brazil | Medium | New visual/map asset |
| Season timeline bar | Low | Derive from existing state |
| Development sparklines | Low | Derive from existing stats history |
| Practice skill pill grid | Low | Replace `<select>` with chip UI |
| Practice pending-change highlight | Low | Track unsaved state visually |
| Team practice allocated-row highlight | Low | CSS only, no data change |
| Team practice play descriptions | Low | Static copy per play key |
| Team practice avg familiarity badge | Low | Derive from existing state |

The highest-ROI changes are the **Coach's Dashboard**, **post-match recap**, and **court lineup builder**. They address the biggest gap: no narrative momentum and no spatial metaphors. Everything else is polish on top of that foundation.

---

## Detailed Page-by-Page Audit (Round 2)

This section adds granular, screen-specific ideas from a full codebase review.

---

### Global Patterns to Fix

Three root causes make the UI feel like a spreadsheet:

1. **No page identity** — most pages start directly with content, no title, no contextual header.
2. **Numbers without meaning** — skill 47, Level 3, reputation 60 — raw numbers with no visual encoding of whether that is good or bad.
3. **Tables as the default** — almost every piece of information becomes rows and columns, even when there are 5–8 items that could be laid out more visually.

---

### Coach Dashboard

- **W/L sequence** — the five letters (W W L W L) should be five colored circles: green for W, red for L. Add a streak label ("2-game win streak") and a season win%.
- **Next Match card** — needs much more weight. Show both team abbreviations in large type facing each other. Show both records (e.g. 8-4 vs 5-7) and a difficulty hint ("Tough matchup" / "Favorable").
- **Season progress strip** — add a horizontal timeline bar at the very top of the dashboard showing "Week 12 of 35." The coach should know where they are in the season at a single glance.
- **Standings table** — the user's own team row must be strongly highlighted, not just a subtle border.

---

### Practice / Player Development

- **Position as jersey badge** — replace the flat position pill with a badge styled like a jersey number. Large, prominent. Position is identity in basketball.
- **Skill quality encoding** — skills below 40 should appear dimmer; above 70 brighter. All 10 buttons should not look identical.
- **Progress ring** — move the "Next pt" progress from the end-of-row bar into a thin arc around the skill value itself. Keeps the info inline with the number.
- **Season growth arrow** — when a skill improved since season start, show "↑2" in green next to the value instead of (or in addition to) the faded old number below.

---

### Team Roster (Skills Table)

- **Color-code all skill values** — red below 40, yellow 40–65, green above 65. This single change makes the table scannable as a game asset, not a spreadsheet.
- **OVR badge as primary column** — move the player's overall average to the leftmost column and make it visually dominant (large number, contrasting color). This is the first thing a coach wants to see.
- **Position grouping** — split the roster into sections: Guards / Forwards / Centers, each with a labeled section header. A flat alphabetical list hides team composition.
- **Starter indicator** — mark the current five starters (from `gameSettings.starters`) with a small badge or highlighted row so it is always visible who is in the lineup.

---

### Team Selection (Pre-Game)

This is the most dramatically important moment in the game loop and currently the most underdesigned screen.

- **Matchup header** — both team nicknames should be displayed very large and centered, with "VS" between them. Show both records (e.g. 8-4 vs 5-7). This needs cinematic weight.
- **Court diagram for lineup selection** — instead of a flat player list, render a simplified half-court with five labeled position slots (PG top, SG/SF wings, PF/C paint). Players are assigned to slots. Makes the tactical decision feel real.
- **Play type icons** — each offensive play type button should have a small diagram icon (a triangle, a crossing arrow, etc.) so the choices feel like basketball concepts, not arbitrary labels.

---

### University / Facilities

- **Star-level indicator** — replace "Level 3" text with ●●●○○ (filled/empty circles) or ★★★☆☆. The progression is immediately readable without parsing a number.
- **Effect description per level** — each facility card should show what the current level provides vs. what the next level adds (e.g. "+5% player skill growth" or "Recruit 3 prospects simultaneously"). Right now the coach upgrades blind.
- **Upgrade progress bar** — show how far into the current level the university is (if that data exists), or at minimum a visual ←●●●—○—○→ strip showing current position on the 1–5 path.
- **Facility icons** — each card (Court, Gym, Medical, Physio, Education, Prestige) should have a distinct icon. Text-only boxes have no visual differentiation.

---

### Playoffs Bracket

- **Full horizontal bracket view** — show all five rounds as columns flowing left to right, with lines connecting winners to their next matchup. This is the universally understood tournament bracket format and immediately answers "who plays who next."
- **User team tracked** — highlight the user's team path through the bracket in the primary color throughout all rounds.
- **Eliminated teams** — gray out or strike through teams that have been eliminated so the live portion of the bracket stands out.

---

### Calendar

- **Week grid layout** — show weeks 1–35 as a grid of boxes. Past weeks show the result (W/L + score). Future weeks show the opponent. Current week is highlighted. This is a calendar, not a match log.
- **Home/Away indicator** — each match entry should clearly show @ or vs so the home/away context is visible without reading the full row.

---

### News Page

- **Score as hero element** — the final score (e.g. 78–65) should be the largest visual element on each news card. It is the most important piece of information and currently appears as small body text.
- **Win/Loss card styling** — wins get a green left border accent; losses get red. The outcome should be readable without parsing any numbers.
- **Week navigation as timeline** — replace the prev/next arrow buttons with a horizontal strip of week numbers. Clicking jumps directly to any week. More spatial, more game-like.
- **Post-match popup** — the news detail modal is the closest thing to a post-game recap screen. Make the score very large at the top, top performers in a highlighted row, then the narrative text below. This is the "final result ceremony."

---

### Medical Department

- **Recovery progress bar** — each injured player should show "Out 3 more weeks" as a visual countdown bar, not a plain number.
- **Injury severity color** — minor (yellow), moderate (orange), serious (red). Coaches need severity at a glance.

---

### Side Menu

- **Team record in header** — show W-L directly under the season/BBU label. "Season 2 — 8-4" is the one piece of information the coach wants constantly visible.
- **Current week indicator** — a small "Wk 12" label somewhere in the sidebar header area.
- **Section group icons** — a small icon per section group (jersey icon for Team, whistle for Recruiting, trophy for League) adds visual texture and speeds scanning.
- **Unread news dot** — a small colored dot on the News menu item when there is unread news for the current week.

---

### Champions History

- **Trophy treatment** — the national champion card should have a prominent trophy icon or visual banner, not just a colored text card.
- **Your university highlighted** — any season where the user's university won or appeared should be visually distinct from all other entries.
- **Expandable condensed view** — show one line per season by default (year + champion name), expandable on click for the full breakdown. The current verbose layout makes scrolling through history feel like reading a log file.

---

## Quick Wins (Highest Impact, Lowest Effort)

| Change | Where | Notes |
|---|---|---|
| Color-code skill values (red/yellow/green) | Roster, Practice, Scouting | CSS only, no data change |
| Stars/circles instead of "Level X" | University / Facilities | One component change |
| Win/Loss border color on news cards | News | CSS conditional |
| W-L record in sidebar header | SideMenu | One line of data |
| Season progress strip (Week X of 35) | Coach Dashboard | Derive from `currentWeek` |
| Larger score display in news cards | News | Font size change |
| Highlighted user row in standings | All standings tables | CSS conditional |
| Streak label on Coach Dashboard | CoachCard | Derive from `last5` |
| Recovery progress bar in Medical | Medical Dept | Calculate from `weeksOut` |

---

## Bigger Structural Changes (Higher Effort, High Impact)

| Change | Where | Notes |
|---|---|---|
| Court diagram for lineup selection | Team Selection | New visual component, consider `@dnd-kit` |
| Full horizontal playoff bracket | Playoffs | Replaces round-by-round grid |
| Visual week grid | Calendar | Replaces flat match table |
| Position-grouped roster with OVR badge | Team Roster | Restructure existing table |
| Large matchup header (pre-game) | Team Selection | New header card design |
