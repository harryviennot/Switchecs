import React, { useContext, useEffect, useState } from "react";
import Switch from "react-switch";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import { SocketContext } from "../contexts/SocketContext";
import "../styles/StartPage.css";

const StartPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { socket } = useContext(SocketContext);
  const [showInput, setShowInput] = useState(false);
  const [gamePin, setGamePin] = useState("");
  const navigate = useNavigate();

  const handleJoinGame = () => {
    setShowInput((prevShowInput) => !prevShowInput);
  };

  const generateRandomGamePin = () => {
    const randomGamePin = Math.floor(Math.random() * 1000000);
    setGamePin(randomGamePin);
  };

  const handleStartGame = () => {
    if (!gamePin) generateRandomGamePin();
    socket.emit("join", gamePin.toString());
  };

  useEffect(() => {
    socket.on("full", (gamePin) => {
      alert(`Game ${gamePin} is full`);
    });
    socket.on("joined", (gamePin) => {
      navigate(`/${gamePin}`);
    });
  }, [socket, navigate]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="start-page">
      <h1 className="title">Switchecs</h1>
      <button className="button" onClick={handleJoinGame}>
        Join Game
      </button>
      <input
        className={`input-box ${showInput ? "show" : ""}`}
        type="text"
        value={gamePin}
        onChange={(e) => setGamePin(e.target.value)}
        placeholder="Enter game pin..."
        onSubmit={handleStartGame}
      />
      <button className="button" onClick={handleStartGame}>
        Start Game
      </button>
      <div className="theme-toggler">
        <label>
          <Switch
            checked={theme === "dark"}
            onChange={toggleTheme}
            offColor="#000"
            onColor="#fff"
            offHandleColor="#fff"
            onHandleColor="#000"
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </label>
      </div>
    </div>
  );
};

export default StartPage;
