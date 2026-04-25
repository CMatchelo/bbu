import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Team from "./pages/Team";
import Home from "./pages/Home";
import { UserProvider } from "./Context/UserContext";
import Layout from "./Components/Layout";
import TeamSelection from "./pages/TeamSelection";
import Calendar from "./pages/calendar";
import UniversityPage from "./pages/university";
import GameScreen from "./pages/gameScreen";
import "./i18n/i18n";
import { Leagues } from "./pages/leagues";
import Stats from "./pages/stats";
import Practice from "./pages/practice";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gameScreen" element={<GameScreen />} />
          <Route element={<Layout />}>
            <Route path="/team" element={<Team />} />
            <Route path="/teamSelection" element={<TeamSelection />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/university" element={<UniversityPage />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/stats" element={<Stats />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
