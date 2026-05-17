import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Team from "./pages/team";
import Home from "./pages/home";
import { UserProvider } from "./Context/UserContext";
import Layout from "./Components/Layout";
import TeamSelection from "./pages/team-selection";
import Calendar from "./pages/calendar";
import UniversityPage from "./pages/university";
import GameScreen from "./pages/game-screen";
import "./i18n/i18n";
import { Leagues } from "./pages/leagues";
import Stats from "./pages/stats";
import Practice from "./pages/practice";
import TeamPractice from "./pages/team-practice";
import MedicalDepto from "./pages/medical-depto";
import LeaguesInjuries from "./pages/leagues-injuries";
import ScoutingPage from "./pages/scouting";
import RecruitingBoardPage from "./pages/recruiting-board";
import CommitmentsPage from "./pages/commitments";
import PlayoffsPage from "./pages/playoffs";
import EndOfSeasonPage from "./pages/end-of-season";
import ChampionsPage from "./pages/champions";
import ConfigsPage from "./pages/configs";
import { AudioProvider } from "./Context/AudioContext";
import { useMenuMusic } from "./hooks/useMenuMusic";

function MusicController() {
  const location = useLocation();
  const disabledRoutes = ["/gameScreen"];
  const shouldPlayMusic = !disabledRoutes.includes(location.pathname);
  useMenuMusic(shouldPlayMusic);
  return null;
}

function App() {
  return (
    <AudioProvider>
    <UserProvider>
      <BrowserRouter>
        <MusicController />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gameScreen" element={<GameScreen />} />
          <Route path="/endOfSeason" element={<EndOfSeasonPage />} />
          <Route element={<Layout />}>
            <Route path="/teamSelection" element={<TeamSelection />} />

            <Route path="/team" element={<Team />} />
            <Route path="/playerDevelopment" element={<Practice />} />
            <Route path="/teamPractice" element={<TeamPractice />} />
            <Route path="/medicalDept" element={<MedicalDepto />} />
            <Route path="/calendar" element={<Calendar />} />

            <Route path="/stats" element={<Stats />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/playoffs" element={<PlayoffsPage />} />
            <Route path="/leaguesInjuries" element={<LeaguesInjuries />} />

            <Route path="/university" element={<UniversityPage />} />

            <Route path="/scouting" element={<ScoutingPage />} />
            <Route path="/recruitingBoard" element={<RecruitingBoardPage />} />
            <Route path="/commitments" element={<CommitmentsPage />} />

            <Route path="/champions" element={<ChampionsPage />} />
            <Route path="/configs" element={<ConfigsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
    </AudioProvider>
  );
}

export default App;
