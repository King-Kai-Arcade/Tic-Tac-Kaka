import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import { ethers } from "ethers"
import GameStatus from "@/components/GameStatus";
import contractABI from "../abis/TicTacKaka.json";

export default function Home() {
  const [gameState, setGameState] = useState(Array(9).fill(null));
  const [isGokuNext, setIsGokuNext] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState("goku")
  const [actionCounter, setActionCounter] = useState(0);
  const [status, setStatus] = useState("")

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

  async function refreshBoard() {
    if (!window.ethereum) {
      setStatus('Please connect to MetaMask.')
      return
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, contractAbi, provider)

      const boardState = await contract.getBoard()
      setGameState(boardState)
    } catch (err) {
      setStatus(`Error: ${err.message}`)
    }
  }

  async function getCurrentPlayer() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, contractAbi, provider)

      const currentPlayer = await contract.currentPlayer()
      setCurrentPlayer(currentPlayer)
    } catch (err) {
      setStatus(`Error: ${err.message}`)
    }
  }

  async function makeMove(num, player) {
    console.log("MAKE MOVE")
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      const tx = await contract.makeMove(num, player)

      await tx.wait()

      const newGameState = [...gameState];
      newGameState[num] = isGokuNext ? "goku" : "dragon-ball";
      setGameState(newGameState);
      setIsGokuNext(!isGokuNext);
      setActionCounter(prev => prev + 1);
      // refreshBoard()
    } catch (err) {
      console.log("error: ", err)
      setStatus(`Error: ${err.message}`)
    }
  }

  async function joinGame() {
    console.log("join game")
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
      const tx = await contract.joinGame()
      
      await tx.wait()
      setActionCounter(prev => prev + 1);

      //Make sure the user can not do anything while transaction is pending

    } catch (err) {
      console.log("error: ", err)
      setStatus(`Error: ${err.message}`)
    }

    setGameState(Array(9).fill(null));
    setIsGokuNext(true);
  }

  useEffect(() => {
    if (!isGokuNext) {
      axios.post("/api/chatGPT", { board: gameState }).then((res) => {
        const parsed = JSON.parse(res.data.result.arguments);
        const move = parsed.move;
        console.log(res.data);
        if (move !== -1) {
          if (gameState[move]) return;
          makeMove(move, "dragon-ball")
          const newGameState = [...gameState];
          newGameState[move] = isGokuNext ? "goku" : "dragon-ball";
          setGameState(newGameState);
          setIsGokuNext(!isGokuNext);
        }
      });
    }
  }, [isGokuNext, gameState]);

  const handleClick = (i) => {
    if (gameState[i]) return;
    makeMove(i, "goku")
    // setCurrentPlayer("dragon-ball")
  };

  return (
    <div className="min-h-screen bg-url('/background.jpg') bg-cover py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Dragon Ball Z Tic Tac Toe</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center py-3 sm:max-w-xl sm:mx-auto px-8 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <h1 className="text-4xl tracking-tight font-extrabold text-orange-600 sm:text-5xl md:text-6xl">
          Dragon Ball Z Tic Tac Toe
        </h1>
        <GameStatus actionCounter={actionCounter}/>

        <div className="grid grid-cols-3 grid-rows-3 gap-6 w-96 h-96 mt-10 border-4 border-yellow-500 rounded-lg ki-blast-border">
          {gameState.map((state, i) => (
            <button
              disabled={currentPlayer === "dragon-ball"}
              key={i}
              className="w-24 h-24 bg-yellow-100 border-2 border-yellow-300 rounded-md focus:outline-none transition-transform duration-500 ease-in-out transform hover:scale-110 hover:rotate-3"
              onClick={() => handleClick(i)}
            >
              {state === "goku" && (
                <img
                  src="/goku.svg"
                  alt="Goku's hair"
                  className="h-16 w-16 mx-auto my-4 animate-pulse"
                />
              )}
              {state === "dragon-ball" && (
                <img
                  src="/dragon-ball.svg"
                  alt="Dragon Ball"
                  className="h-16 w-16 mx-auto my-4 animate-spin-slow"
                />
              )}
            </button>
          ))}
        </div>

        <button
          className="mt-10 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none transition-transform duration-500 ease-in-out transform hover:scale-110"
          onClick={() => {
            joinGame()
          }}
        >
          Start New Game
        </button>
      </main>
    </div>
  );
}
