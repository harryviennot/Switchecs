import "./App.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import GamePage from "./pages/GamePage";
import { ThemeProvider } from "./contexts/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<StartPage />} />
          <Route path="/:gamePin" element={<GamePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
