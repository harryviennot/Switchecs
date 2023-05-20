import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Chessboard from "chessboardjsx";
import Switch from "react-switch";
import { ThemeContext } from "../contexts/ThemeContext";
import "../styles/GamePage.css";

const GamePage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { gamePin } = useParams();

  const boardStyle = {
    borderRadius: "5px",
    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
  };

  const darkSquareStyle = { backgroundColor: "#2B2B2B" };
  const lightSquareStyle = { backgroundColor: "#F5F5DC" };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="game-page">
      <h1 className="game-pin">Game Pin: {gamePin}</h1>
      <Chessboard
        position="start"
        boardStyle={boardStyle}
        darkSquareStyle={darkSquareStyle}
        lightSquareStyle={lightSquareStyle}
      />
      <div className="theme-toggler">
        <label>
          <Switch
            checked={theme === "dark"}
            onChange={toggleTheme}
            offColor="#000"
            onColor="#fff"
            offHandleColor="#fff"
            onHandleColor="#000"
            handleDiameter={20}
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </label>
      </div>
    </div>
  );
};

export default GamePage;
