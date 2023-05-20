import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chessboard from "chessboardjsx";
import Switch from "react-switch";
import { ThemeContext } from "../contexts/ThemeContext";
import { ChessGame } from "../utils/chessLogic";
import "../styles/GamePage.css";

const GamePage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [game] = useState(new ChessGame());
  const [fen, setFen] = useState(game.getFen());
  const { gamePin } = useParams();

  const boardStyle = {
    borderRadius: "5px",
    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
  };

  const darkSquareStyle = { backgroundColor: "#2B2B2B" };
  const lightSquareStyle = { backgroundColor: "#F5F5DC" };

  const handleMove = ({ sourceSquare, targetSquare }) => {
    console.log(sourceSquare, targetSquare);
    const move = game.move(sourceSquare, targetSquare);
    if (move !== null) {
      setFen(game.getFen());
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="game-page">
      <h1 className="game-pin">Game Pin: {gamePin}</h1>
      <Chessboard
        position={fen}
        boardStyle={boardStyle}
        darkSquareStyle={darkSquareStyle}
        lightSquareStyle={lightSquareStyle}
        onDrop={(move) =>
          handleMove({
            sourceSquare: move.sourceSquare,
            targetSquare: move.targetSquare,
          })
        }
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
