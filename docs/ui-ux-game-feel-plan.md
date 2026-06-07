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
