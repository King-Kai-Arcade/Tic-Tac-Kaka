import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function Home() {
  const [gameState, setGameState] = useState(Array(9).fill(null));
  const [isGokuNext, setIsGokuNext] = useState(true);
  
  useEffect(() => {
    if (!isGokuNext) {
      axios.post("/api/chatGPT", { gameState: gameState }).then((res) => {
        const parsed = JSON.parse(res.data.result.arguments);
        const move = parsed.move;
        console.log(res.data);
        if (move !== -1) {
          handleClick(move);
        }
      });
    }
}, [isGokuNext, gameState]);


  const handleClick = (i) => {
    if (gameState[i]) return;
    const newGameState = [...gameState];
    newGameState[i] = isGokuNext ? 'goku' : 'dragon-ball';
    setGameState(newGameState);
    setIsGokuNext(!isGokuNext);
  }

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

        <div className="grid grid-cols-3 grid-rows-3 gap-6 w-96 h-96 mt-10 border-4 border-yellow-500 rounded-lg ki-blast-border">
          {gameState.map((state, i) => (
            <button 
              key={i} 
              className="w-24 h-24 bg-yellow-100 border-2 border-yellow-300 rounded-md focus:outline-none transition-transform duration-500 ease-in-out transform hover:scale-110 hover:rotate-3" 
              onClick={() => handleClick(i)}
            >
              {state === 'goku' && <img src="/goku.svg" alt="Goku's hair" className="h-16 w-16 mx-auto my-4 animate-pulse" />}
              {state === 'dragon-ball' && <img src="/dragon-ball.svg" alt="Dragon Ball" className="h-16 w-16 mx-auto my-4 animate-spin-slow" />}
            </button>
          ))}
        </div>

        <button 
          className="mt-10 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none transition-transform duration-500 ease-in-out transform hover:scale-110"
          onClick={() => {
            setGameState(Array(9).fill(null));
            setIsGokuNext(true);
          }}
        >
          Start New Game
        </button>
      </main>
    </div>
  );
}
