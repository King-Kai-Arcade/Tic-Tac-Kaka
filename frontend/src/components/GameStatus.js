import { useEffect, useState } from "react";
import { ethers, BrowserProvider } from "ethers";

const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "ErrorOccurred",
    type: "event",
  },
  {
    inputs: [],
    name: "joinGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "position",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "player",
        type: "string",
      },
    ],
    name: "makeMove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "player",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "position",
        type: "uint8",
      },
    ],
    name: "MoveMade",
    type: "event",
  },
  {
    inputs: [],
    name: "ai",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "board",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentPlayer",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gameFinished",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBoard",
    outputs: [
      {
        internalType: "string[9]",
        name: "",
        type: "string[9]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGameStatus",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "human",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const contractAddress = "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB"; // Contract address goes here

function GameStatus({ actionCounter }) {
  const [gameStatus, setGameStatus] = useState("");

  useEffect(() => {
    async function fetchGameStatus() {
      if (!window.ethereum) {
        setStatus("Please connect to MetaMask.");
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );
        const status = await contract.getGameStatus();
        setGameStatus(status);
      } catch (err) {
        console.error("Error fetching game status:", err);
      }
    }

    fetchGameStatus();
  }, [actionCounter]);

  return (
    <div className="bg-green-200 text-green-700 py-2 px-4 rounded-full text-lg font-semibold mb-4">
      {gameStatus}
    </div>
  );
}

export default GameStatus;
