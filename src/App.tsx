import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import MedicalDepto from "./pages/medical-depto";
import LeaguesInjuries from "./pages/leagues-injuries";
import ScoutingPage from "./pages/scouting";
import RecruitingBoardPage from "./pages/recruiting-board";
import CommitmentsPage from "./pages/commitments";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gameScreen" element={<GameScreen />} />
          <Route element={<Layout />}>
            <Route path="/teamSelection" element={<TeamSelection />} />

            <Route path="/team" element={<Team />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/medicalDept" element={<MedicalDepto />} />
            <Route path="/calendar" element={<Calendar />} />

            <Route path="/stats" element={<Stats />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/leaguesInjuries" element={<LeaguesInjuries />} />
            
            <Route path="/university" element={<UniversityPage />} />

            <Route path="/scouting" element={<ScoutingPage />} />
            <Route path="/recruitingBoard" element={<RecruitingBoardPage />} />
            <Route path="/commitments" element={<CommitmentsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
