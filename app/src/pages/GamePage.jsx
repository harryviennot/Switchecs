import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Chessboard from "chessboardjsx";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import "../styles/GamePage.css";

const GamePage = () => {
  const [fen, setFen] = useState();
  const [spinning, setSpinning] = useState(false);
  const spinTimeout = useRef(null);
  const { gamePin } = useParams();
  const { socket } = useContext(SocketContext);
  const [turn, setTurn] = useState("white");
  const [color, setColor] = useState("white");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  const boardStyle = {
    borderRadius: "5px",
    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
  };

  const darkSquareStyle = { backgroundColor: "#2B2B2B" };
  const lightSquareStyle = { backgroundColor: "#F5F5DC" };

  const handleMove = (move) => {
    if (turn !== color) return;
    socket.emit("move", move, gamePin);
  };

  const handleLeaveGame = () => {
    socket.emit("leave", gamePin);
    navigate("/");
  };

  useEffect(() => {
    document.body.className = color === "white" ? "light" : "dark";
  }, [color]);

  useEffect(() => {
    const onUpdate = (data) => {
      console.log("update", data);
      const { fen, turn } = data;
      setFen(fen);
      setTurn(turn);
    };

    const onColor = (color) => {
      setColor(color);
    };

    const onSwitchTurns = () => {
      console.log("switch turns");
      setSpinning(true);

      if (spinTimeout.current) {
        clearTimeout(spinTimeout.current);
      }

      spinTimeout.current = setTimeout(() => {
        setSpinning(false);
        spinTimeout.current = null;
      }, 1000);
      setColor((prevColor) => (prevColor === "white" ? "black" : "white"));
    };

    const onGameWon = (winner) => {
      setResult(winner === color ? "You won!" : "You lost!");
    };

    const userLeft = (gamePin) => {
      console.log("user left");
      setResult("Opponent left");
    };

    socket.on("update", onUpdate);
    socket.on("color", onColor);
    socket.on("switch turns", onSwitchTurns);
    socket.on("game won", onGameWon);
    socket.on("userLeft", userLeft);

    return () => {
      socket.off("update", onUpdate);
      socket.off("color", onColor);
      socket.off("switch turns", onSwitchTurns);
      if (spinTimeout.current) {
        clearTimeout(spinTimeout.current);
      }
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("getColor", gamePin);
    socket.emit("getFen", gamePin);
  }, [gamePin, socket]);

  return (
    <div className={"game-page " + color}>
      <div className="game-info">
        <small className="game-pin">Game Pin: {gamePin}</small>
        <h1>{result || turn === color ? "Your turn" : "Opponent's turn"}</h1>
      </div>
      <div className={spinning ? "chessboard spinning" : "chessboard"}>
        <Chessboard
          position={fen}
          boardStyle={boardStyle}
          darkSquareStyle={darkSquareStyle}
          lightSquareStyle={lightSquareStyle}
          orientation={color}
          onDrop={(move) =>
            handleMove({
              from: move.sourceSquare,
              to: move.targetSquare,
            })
          }
        />
      </div>
      <button className="button" onClick={handleLeaveGame}>
        Leave Game
      </button>
    </div>
  );
};

export default GamePage;
