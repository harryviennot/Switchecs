import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import GamePage from "./pages/GamePage";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";

const App = () => {
  return (
    <ThemeProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<StartPage />} />
            <Route path="/:gamePin" element={<GamePage />} />
          </Routes>
        </Router>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
