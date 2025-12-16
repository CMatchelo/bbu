import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Team from "./pages/Team";
import Home from "./pages/Home";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/index.ts";
import { useEffect } from "react";
import { loadGameData } from "./store/slices/dataSlice";
import { UserProvider } from "./Context/UserContext";
import Layout from "./Components/Layout";
import TeamSelection from "./pages/TeamSelection";
import Calendar from "./pages/calendar";
import UniversityPage from "./pages/university";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadGameData());
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<Layout />}>
            <Route path="/team" element={<Team />} />
            <Route path="/teamSelection" element={<TeamSelection />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/university" element={<UniversityPage />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
