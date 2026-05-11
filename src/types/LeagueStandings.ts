export type PlayoffResult =
  | 'round1'
  | 'round2'
  | 'quarterfinal'
  | 'semifinal'
  | 'runner_up'
  | 'champion'

export type SeasonRecord = {
  season: number
  regionalRank: number
  playoffResult: PlayoffResult | null
}

export type LeagueStandings = {
  year: number
  ne_league: string
  n_league: string
  cw_league: string
  se_league: string
  s_league: string
  nationalChampion: string
}
