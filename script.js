document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const modeSelector = document.getElementById('mode');
    const turnElement = document.getElementById('turn');
    const statusElement = document.getElementById('status');
    const playerXScoreElement = document.getElementById('playerXScore');
    const playerOScoreElement = document.getElementById('playerOScore');
    const modalElement = document.getElementById('modal');
    const modalMessageElement = document.getElementById('modal-message');
    const playAgainButton = document.getElementById('play-again');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let playerMode = modeSelector.value; // Default: Player vs Player
    let playerXScore = 0;
    let playerOScore = 0;

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const renderBoard = () => {
        boardElement.innerHTML = '';
        board.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (value === 'X' || value === 'O') {
                cell.textContent = value;
            }
            cell.addEventListener('click', () => handleCellClick(index));
            boardElement.appendChild(cell);
        });
        updateBoardColors();
    };

    const handleCellClick = (index) => {
        if (gameActive && board[index] === '') {
            board[index] = currentPlayer;
            renderBoard();

            if (checkWinner()) {
                endGame(`${currentPlayer} Wins!`);
            } else if (board.every(cell => cell !== '')) {
                endGame('Draw!');
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateTurn();
                if (playerMode === 'pva' && currentPlayer === 'O') {
                    makeAIMove();
                }
            }
        }
    };

    const updateTurn = () => {
        turnElement.textContent = `Turn: Player ${currentPlayer}`;
    };

    const checkWinner = () => {
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                highlightWinningCells(pattern);
                return board[a];
            }
        }
        return null;
    };

    const highlightWinningCells = (pattern) => {
        pattern.forEach((index) => {
            const cellElement = boardElement.children[index];
            cellElement.classList.add('winner');
        });
    };

    const endGame = (message) => {
        gameActive = false;
        statusElement.textContent = message;

        if (message.includes('Wins')) {
            currentPlayer === 'X' ? playerXScore++ : playerOScore++;
            updateScore();
        }

        showModal(message);
    };

    const updateScore = () => {
        playerXScoreElement.textContent = `Player X: ${playerXScore}`;
        playerOScoreElement.textContent = `Player O: ${playerOScore}`;
    };

    const showModal = (message) => {
        modalMessageElement.textContent = message;
        modalElement.style.display = 'flex';
    };

    const hideModal = () => {
        modalElement.style.display = 'none';
    };

    const makeAIMove = () => {
        let bestMove;

        // Rastgele bir hamle yapılacak ilk tur
        if (board.filter(cell => cell !== '').length === 1) {
            bestMove = getRandomMove();
        } else {
            // İlerleyen turlarda stratejik hamle yapılacak
            bestMove = getBestMove();
        }

        handleCellClick(bestMove);
    };

    const getRandomMove = () => {
        const emptyCells = board.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    };

    const getBestMove = () => {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    };

    const minimax = (board, depth, isMaximizing) => {
        const scores = {
            X: -1,
            O: 1,
            tie: 0
        };

        const winner = checkWinner();
        if (winner !== null) {
            return scores[winner] / depth;
        }

        if (isTerminal()) {
            return 0;
        }

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
    };

    const updateBoardColors = () => {
        for (let i = 0; i < 9; i++) {
            const cellElement = boardElement.children[i];
            cellElement.classList.remove('winner');
        }
    };

    const isTerminal = () => {
        return checkWinner() !== null || board.every(cell => cell !== '');
    };

    modeSelector.addEventListener('change', () => {
        const previousMode = playerMode;
        playerMode = modeSelector.value;

        if (previousMode !== playerMode) {
            // Oyun modu değiştiğinde skorları sıfırla
            playerXScore = 0;
            playerOScore = 0;
            updateScore();
        }

        resetGame();
    });

    playAgainButton.addEventListener('click', () => {
        hideModal();
        resetGame();
    });

    const resetGame = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        statusElement.textContent = '';
        renderBoard();

        if (playerMode === 'pva' && currentPlayer === 'O') {
            makeAIMove();
        }
    };

    resetGame();
});
