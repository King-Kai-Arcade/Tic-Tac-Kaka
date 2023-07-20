import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import { ethers } from "ethers";
import GameStatus from "@/components/GameStatus";
import BoardOverlay from "@/components/BoardOverlay";
import PlayerPiece from "@/components/PlayerPiece";
import contractABI from "../abis/TicTacKaka.json";

export default function Home() {
  const [gameState, setGameState] = useState(Array(9).fill(null));
  const [isGokuNext, setIsGokuNext] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState("goku");
  const [actionCounter, setActionCounter] = useState(0);
  const [status, setStatus] = useState("");
  const [gameFinished, setGameFinished] = useState(true);
  const [spacePendingTx, setSpacePendingTx] = useState(-1);
  const [joinText, setJoinText] = useState("Start New Game");

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  useEffect(() => {
    console.log("Restoring game");
    refreshBoard();
    getCurrentPlayer();
    getGameFinished();
  }, []);

  async function refreshBoard() {
    console.log("REFRESH BOARD");
    if (!window.ethereum) {
      console.log("not connected to ethereum");
      setStatus("Please connect to MetaMask.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const boardState = await contract.getBoard();
      console.log("board state on contract: ", boardState);
      setGameState(boardState);
      const gameFinished = await contract.gameFinished();
      setGameFinished(gameFinished);
      setActionCounter((prev) => prev + 1);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  async function getCurrentPlayer() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const currentPlayer = await contract.currentPlayer();
      setCurrentPlayer(currentPlayer);
      console.log("current player: ", currentPlayer);
      if (currentPlayer === "frieza") {
        setIsGokuNext(false);
      } else {
        setIsGokuNext(true);
      }
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  async function getGameFinished() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );

      const gameFinished = await contract.gameFinished();
      setGameFinished(gameFinished);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  async function makeMove(num, player) {
    console.log("MAKE MOVE");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const checkGameFinished = await contract.gameFinished();
      if (checkGameFinished) return;

      let newGameState = [...gameState];
      newGameState[num] = player;
      setGameState(newGameState);

      setSpacePendingTx(num);
      const tx = await contract.makeMove(num, player);
      await tx.wait();
      setSpacePendingTx(-1);

      refreshBoard();

      const currentPlayer = await contract.currentPlayer();
      if (player == "frieza" && currentPlayer === "frieza") {
        makeMove(move, "frieza");
      }

      setIsGokuNext(!isGokuNext);
    } catch (err) {
      console.log("error: ", err);
      setStatus(`Error: ${err.message}`);
    }
  }

  async function joinGame() {
    console.log("join game");
    setJoinText("Creating Game...");
    setGameFinished(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const tx = await contract.joinGame();

      await tx.wait();
      setActionCounter((prev) => prev + 1);

      //Make sure the user can not do anything while transaction is pending
    } catch (err) {
      console.log("error: ", err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setJoinText("Start New Game");
    }

    refreshBoard();
    setIsGokuNext(true);
  }

  useEffect(() => {
    console.log("Frieza's turn | isGokuNext: ", isGokuNext);

    if (!isGokuNext) {
      axios.post("/api/chatGPT", { board: gameState }).then((res) => {
        const parsed = JSON.parse(res.data.result.arguments);
        const move = parsed.move;
        console.log(res.data);
        console.log("move: ", move);
        if (move !== -1) {
          if (gameState[move]) return;
          makeMove(move, "frieza");

          setIsGokuNext(!isGokuNext);
        }
      });
    }
  }, [isGokuNext]);

  const handleClick = (i) => {
    if (gameState[i]) return;
    makeMove(i, "goku");
    // setCurrentPlayer("frieza")
  };

  return (
    <div
      className="min-h-screen bg-cover py-6 flex flex-col justify-center sm:py-12"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <Head>
        <title>Tic Tac Kaka</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center py-3 sm:max-w-xl sm:mx-auto px-8 py-10 bg-white bg-opacity-90 shadow-lg sm:rounded-3xl sm:p-20">
        <h1 className="text-4xl tracking-tight font-extrabold text-orange-600 sm:text-5xl md:text-6xl mb-0 text-center">
          Beat Frieza
        </h1>
        <p className="mb-6 text-center text-xl text-gray-600 tracking-widest">
          Tic-Tac-Kaka
        </p>
        <GameStatus actionCounter={actionCounter} />

        <div className="grid grid-cols-3 grid-rows-3 gap-6 w-96 h-96 m-4 p-4 border-4 border-yellow-500 rounded-lg ki-blast-border relative">
          <BoardOverlay show={gameFinished} />
          {gameState.map((state, i) => (
            <button
              // disabled={currentPlayer === "frieza" || gameFinished == true}
              key={i}
              className="w-24 h-24 bg-yellow-100 border-2 border-yellow-300 rounded-md focus:outline-none transition-transform duration-500 ease-in-out transform hover:scale-110 hover:rotate-3"
              onClick={() => handleClick(i)}
            >
              <PlayerPiece
                state={state}
                pending={spacePendingTx === i ? true : false}
              />
            </button>
          ))}
        </div>

        <button
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none transition-transform duration-500 ease-in-out transform hover:scale-110"
          onClick={() => {
            joinGame();
          }}
        >
          {joinText}
        </button>
      </main>
    </div>
  );
}
