import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import { ethers } from "ethers";

export default function Home() {
  const [gameState, setGameState] = useState(Array(9).fill(null));
  const [isGokuNext, setIsGokuNext] = useState(true);
  const [account, setAccount] = useState(null)
  const [aiAccount, setAiAccount] = useState(null)

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const contractAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "row",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "col",
          "type": "uint8"
        }
      ],
      "name": "MoveMade",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "board",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentPlayer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gameFinished",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBoard",
      "outputs": [
        {
          "internalType": "uint8[3][3]",
          "name": "",
          "type": "uint8[3][3]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "joinGame",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "row",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "col",
          "type": "uint8"
        }
      ],
      "name": "makeMove",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "player1",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "player2",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  async function connectWallet() {
    console.log(typeof window.ethereum)
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
      console.log(account)
    } else {
      setStatus('Metamask is not installed. Please install it first.')
    }
  }

  function connectAiWallet() {
    const wallet = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d")
    const provider = new ethers.JsonRpcProvider("http://0.0.0.0:3030")
    const signer = wallet.connect(provider)
    setAiAccount(wallet.address)
  }

  useEffect(() => {
    connectAiWallet()
  }, [])

  const fundAI = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const tx = await signer.sendTransaction({
      to: aiAccount,
      value: ethers.parseEther("0.1")
    });

    const aiBalance = await provider.getBalance(aiAccount)
    console.log(aiBalance)
  }

  const joinGame = async () => {
    const wallet = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d")
    const provider = new ethers.JsonRpcProvider("http://0.0.0.0:3030")
    const signer = wallet.connect(provider)
    const contract = new ethers.Contract(contractAddress, contractAbi, signer)
    const tx = await contract.joinGame()
    console.log(tx)
  }

  useEffect(() => {
    if (!isGokuNext) {
      axios.post("/api/chatGPT", { board: gameState }).then((res) => {
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
    newGameState[i] = isGokuNext ? "goku" : "dragon-ball";
    setGameState(newGameState);
    setIsGokuNext(!isGokuNext);
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

        <div className="grid grid-cols-3 grid-rows-3 gap-6 w-96 h-96 mt-10 border-4 border-yellow-500 rounded-lg ki-blast-border">
          {gameState.map((state, i) => (
            <button
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
            setGameState(Array(9).fill(null));
            setIsGokuNext(true);
          }}
        >
          Start New Game
        </button>
        <button onClick={connectWallet} className="mt-8 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
          Connect Wallet
        </button>
        <button onClick={fundAI} className="mt-8 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
          Fund AI Wallet
        </button>
        <button onClick={joinGame} className="mt-8 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
          AI Join Game
        </button>
      </main>
    </div>
  );
}
