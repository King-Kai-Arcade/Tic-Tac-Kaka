// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicTacKaka {
    string public human = "goku";
    string public ai = "dragon-ball";
    string public currentPlayer;
    bool public gameFinished;
    string[9] public board;

    event MoveMade(string indexed player, uint8 indexed position);
    event ErrorOccurred(string indexed reason);

    constructor() {
        currentPlayer = human;
    }

    function joinGame() external {
        for(uint8 i = 0; i < 9; i++) {
            board[i] = "";
        }
    }

    function makeMove(uint8 position, string calldata player) external {
        if(keccak256(bytes(player)) != keccak256(bytes(human)) && keccak256(bytes(player)) != keccak256(bytes(ai))) {
            emit ErrorOccurred("You are not a player");
            return;
        }

        if(keccak256(bytes(player)) != keccak256(bytes(currentPlayer))) {
            emit ErrorOccurred("Not your turn");
            return;
        }

        if(gameFinished) {
            emit ErrorOccurred("Game is finished");
            return;
        }

        if(position >= 9) {
            emit ErrorOccurred("Invalid position");
            return;
        }

        if(keccak256(bytes(board[position])) != keccak256(bytes(""))) {
            emit ErrorOccurred("Cell is already occupied");
            return;
        }

        board[position] = player;

        emit MoveMade(currentPlayer, position);

        if (checkWinner(currentPlayer)) {
            gameFinished = true;
        } else if (checkDraw()) {
            gameFinished = true;
        } else {
            currentPlayer = keccak256(bytes(currentPlayer)) == keccak256(bytes(human)) ? ai : human;
        }
    }

    function checkWinner(string memory player) internal view returns (bool) {
        uint8[3][8] memory winningPositions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (uint8 i = 0; i < 8; i++) {
            if (
                keccak256(bytes(board[winningPositions[i][0]])) == keccak256(bytes(player)) && 
                keccak256(bytes(board[winningPositions[i][1]])) == keccak256(bytes(player)) && 
                keccak256(bytes(board[winningPositions[i][2]])) == keccak256(bytes(player))
            ) {
                return true;
            }
        }

        return false;
    }

    function checkDraw() internal view returns (bool) {
        for (uint8 i = 0; i < 9; i++) {
            if (keccak256(bytes(board[i])) == keccak256(bytes(""))) {
                return false;
            }
        }
        return true;
    }

    function getBoard() external view returns (string[9] memory) {
        return board;
    }
}
