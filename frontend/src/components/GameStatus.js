import { useEffect, useState } from "react";
import { ethers, BrowserProvider } from "ethers";
import contractABI from "../abis/TicTacKaka.json";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

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
