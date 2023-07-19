// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicTacToe {
    address public player;
    bool public playerTurn;
    bool public gameFinished;
    uint8[3][3] public board;

    event MoveMade(address indexed player, uint8 indexed row, uint8 indexed col);

    constructor() {
        player = msg.sender;
        playerTurn = true;
    }

    modifier onlyPlayer() {
        require(msg.sender == player, "You are not the player");
        _;
    }

    modifier playerCanMove() {
        require(!gameFinished && playerTurn, "It's not your turn");
        _;
    }

    function makeMove(uint8 row, uint8 col) external onlyPlayer playerCanMove {
        require(row < 3 && col < 3, "Invalid position");
        require(board[row][col] == 0, "Cell is already occupied");

        // Player's move
        board[row][col] = 1;
        emit MoveMade(player, row, col);

        if (checkWinner(player)) {
            gameFinished = true;
        } else if (checkDraw()) {
            gameFinished = true;
        } else {
            playerTurn = false;
            // Make the AI move after a short delay (for simulation purposes)
            // You may want to implement a more sophisticated AI logic.
            makeAIMove();
        }
    }

    function makeAIMove() internal {
        // Simple AI logic: find the first empty cell and place AI's move there.
        for (uint8 i = 0; i < 3; i++) {
            for (uint8 j = 0; j < 3; j++) {
                if (board[i][j] == 0) {
                    board[i][j] = 2; // AI's move
                    emit MoveMade(address(0), i, j); // Emit AI's move event
                    if (checkWinner(address(this))) {
                        gameFinished = true;
                    } else if (checkDraw()) {
                        gameFinished = true;
                    }
                    playerTurn = true;
                    return;
                }
            }
        }
    }

    function checkWinner(address _player) internal view returns (bool) {
        uint8 playerValue = _player == address(this) ? 2 : 1;

        for (uint8 i = 0; i < 3; i++) {
            if (
                board[i][0] == playerValue && board[i][1] == playerValue && board[i][2] == playerValue ||
                board[0][i] == playerValue && board[1][i] == playerValue && board[2][i] == playerValue
            ) {
                return true;
            }
        }

        if (
            board[0][0] == playerValue && board[1][1] == playerValue && board[2][2] == playerValue ||
            board[0][2] == playerValue && board[1][1] == playerValue && board[2][0] == playerValue
        ) {
            return true;
        }

        return false;
    }

    function checkDraw() internal view returns (bool) {
        for (uint8 i = 0; i < 3; i++) {
            for (uint8 j = 0; j < 3; j++) {
                if (board[i][j] == 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function getBoard() external view returns (uint8[3][3] memory) {
        return board;
    }
}