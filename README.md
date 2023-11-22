<h1 align="center">Tic Tac Toe</h1>

<p align="center">
  Welcome to the Tic Tac Toe Game! This project provides a simple and interactive Tic Tac Toe game implemented using HTML5, CSS, and JavaScript. The game supports both Player vs Player and Player vs AI modes.
</p>

<p align="center">
  <img src="https://lh3.googleusercontent.com/y3Mp0ZW7r7v8Mo7IutRsqFLMh2Z6C_VAN_npDVIo8eDBA7lNDXCu76ztwNgSEgtMoj1v7AFKX0idGOP-eRC3P7FqLKQgqMtKd7I=s0" alt="Snake Game Logo">
</p>

<p align="center">
  ⭐️ If you find this project useful, consider giving it a <b>star</b> to show your support. ⭐
</p>

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Installation](#getting-started)
- [How to Play](#how-to-play)
- [Game Modes](#game-modes)
- [Minimax Algorithm](#minimax-algorithm)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## Demo

[Live Demo](https://ramazancetinkaya.github.io/tictactoe/)

Good luck, have fun!

## Features

- **Player vs Player:** Play against a friend on the same device.
- **Player vs AI:** Challenge the AI using the minimax algorithm for an exciting single-player experience.
- **Dynamic Game Mode Selection:** Easily switch between Player vs Player and Player vs AI with a stylized select box.
- **Score Tracking:** Keep track of the scores for Player X and Player O.
- **Turn Indicator:** Display whose turn it is dynamically.
- **Game Status:** Show the current game status dynamically.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Web browser (Chrome, Firefox, Safari, etc.)
- Git (optional, for cloning the repository)

### Installation

No installation is required. Simply clone or download the repository and open the `index.html` file in a web browser to play the game.

1. Clone the repository:

    ```bash
    git clone https://github.com/ramazancetinkaya/tictactoe.git
    ```

## How to Play

- Choose the game mode from the dropdown (PvP or PvA).
- Click on an empty cell to make a move.
- The game indicates the current player's turn.
- The game ends when a player wins, or it's a draw.
- If you're playing against the AI, it will make its move automatically.    

## Game Modes

The game supports two modes:

1. **Player vs Player (PvP):** Two players take turns to make moves.
2. **Player vs AI (PvA):** Player plays against the AI using the Minimax algorithm.


## Minimax Algorithm

The Minimax algorithm is a decision-making algorithm commonly used in two-player turn-based games like Tic Tac Toe. It explores all possible moves on the game board and assigns a score to each move. The AI player then chooses the move with the highest score if it wants to maximize its chances of winning or the lowest score if it wants to minimize the opponent's chances.

Here is a simple explanation of how the Minimax algorithm works:

1. **Recursive Exploration:**
   - The algorithm explores all possible moves by simulating each move and its possible outcomes.
   - It alternates between maximizing and minimizing players at each level of the game tree.

2. **Scoring:**
   - A score is assigned to each terminal state of the game (win, lose, or draw).
   - The algorithm backtracks these scores through the game tree, updating scores for each intermediate state.

3. **Maximizing and Minimizing:**
   - At each level, the algorithm maximizes the score for the maximizing player and minimizes the score for the minimizing player.
   - The maximizing player aims to get the highest score, while the minimizing player aims to get the lowest score.

4. **Best Move:**
   - The algorithm chooses the move that leads to the best possible outcome for the player, based on the scores calculated.

Here is a simple implementation of the Minimax algorithm in JavaScript:

```javascript
function minimax(board, depth, isMaximizing) {
    // Base Case
    const winner = checkWinner();
    if (winner !== null) {
        return scores[winner];
    }

    // Recursive Case
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
```

## Technologies Used

- HTML5
- CSS
- JavaScript

## Contributing

Contributions are welcome! If you'd like to contribute to this project, feel free to fork the repository and submit a pull request with your changes.

If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

For major changes, please open an issue first to discuss what you would like to change.

## Credits

This project is created by Ramazan Çetinkaya.

## License

This project is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.
