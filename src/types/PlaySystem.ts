export type PlaytypeEntry = {
  familiarity: number;
  practicingPoints: number;
};

export type OffensivePlaySystem = {
  PickAndRoll: PlaytypeEntry;
  Motion: PlaytypeEntry;
  Isolation: PlaytypeEntry;
  FiveOut: PlaytypeEntry;
  PostUp: PlaytypeEntry;
  FastBreak: PlaytypeEntry;
};

export type DefensivePlaySystem = {
  ManToMan: PlaytypeEntry;
  Zone: PlaytypeEntry;
  PerimeterPressure: PlaytypeEntry;
  FullCourtPress: PlaytypeEntry;
  SwitchEverything: PlaytypeEntry;
  PackedPaint: PlaytypeEntry;
};

export const OFFENSIVE_PLAY_LABELS: Record<keyof OffensivePlaySystem, string> = {
  PickAndRoll: "Pick & Roll",
  Motion: "Motion",
  Isolation: "Isolation",
  FiveOut: "5-Out",
  PostUp: "Post-Up",
  FastBreak: "Fast Break",
};

export const DEFENSIVE_PLAY_LABELS: Record<keyof DefensivePlaySystem, string> = {
  ManToMan: "Man-to-Man",
  Zone: "Zone",
  PerimeterPressure: "Perimeter Pressure",
  FullCourtPress: "Full Court Press",
  SwitchEverything: "Switch Everything",
  PackedPaint: "Packed Paint",
};
