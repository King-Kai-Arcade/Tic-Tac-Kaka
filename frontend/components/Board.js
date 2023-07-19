import { useState, useEffect } from "react";
import axios from "axios";
import Square from "./Square";

export default function Board() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  // Make AI move whenever it's O's turn
  useEffect(() => {
    if (!isXNext) {
      axios.post("/api/chatGPT", { board }).then((res) => {
        const parsed = JSON.parse(res.data.result.arguments);
        const move = parsed.move;
        console.log(res.data);
        if (move !== -1) {
          makeMove(move);
        }
      });
    }
  }, [isXNext]);

  const makeMove = (i) => {
    const newBoard = board.slice();
    newBoard[i] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  return (
    <div
      style={{
        display: "grid",
        width: "180px", // Add a fixed width to the board
        height: "180px", // Add a fixed height to the board
        gridTemplateRows: "60px 60px 60px", // Specify size in pixels
        gridTemplateColumns: "60px 60px 60px", // Specify size in pixels
        gap: "0",
      }}
    >
      {board.map((value, i) => (
        <Square key={i} value={value} onClick={() => makeMove(i)} />
      ))}
    </div>
  );
}
