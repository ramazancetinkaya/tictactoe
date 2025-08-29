/**
 * @project     Tic-Tac-Toe Game
 * @author      Ramazan Çetinkaya
 * @github      https://github.com/ramazancetinkaya
 *
 * @copyright   Copyright (c) 2025 Ramazan Çetinkaya
 * @license     Released under the MIT License.
 *
 * This script manages the entire game logic for a Tic-Tac-Toe game
 * against a multi-difficulty AI opponent.
 */

// =================================================================================
// I. DOM ELEMENT SELECTION & GAME STATE
// =================================================================================

// --- DOM Elements ---
// Caching all necessary DOM elements for performance.
const startMenu = document.getElementById('start-menu');
const gameScreen = document.getElementById('game-screen');
const pickXBtn = document.getElementById('pick-x');
const pickOBtn = document.getElementById('pick-o');
const newGameBtn = document.getElementById('new-game-btn');
const cells = document.querySelectorAll('.board-cell');
const turnIcon = document.getElementById('turn-icon');
const playerScoreEl = document.getElementById('player-score');
const tieScoreEl = document.getElementById('tie-score');
const cpuScoreEl = document.getElementById('cpu-score');
const playerScoreLabel = document.getElementById('player-score-label');
const cpuScoreLabel = document.getElementById('cpu-score-label');
const resultModal = document.getElementById('result-modal');
const restartModal = document.getElementById('restart-modal');
const modalResultText = document.getElementById('modal-result-text');
const modalWinnerAnnouncement = document.getElementById('modal-winner-announcement');
const quitBtn = document.getElementById('quit-btn');
const nextRoundBtn = document.getElementById('next-round-btn');
const restartBtn = document.getElementById('restart-btn');
const cancelRestartBtn = document.getElementById('cancel-restart-btn');
const confirmRestartBtn = document.getElementById('confirm-restart-btn');
const difficultyBtns = document.querySelectorAll('.difficulty-buttons .btn');
const thinkingIndicator = document.getElementById('thinking-indicator');

// --- Game State Variables ---
// These variables track the current state of the game.
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'x'; // 'x' always starts the first turn.
let playerSymbol = 'x';
let cpuSymbol = 'o';
let isGameOver = false;
let scores = { player: 0, tie: 0, cpu: 0 };
let difficulty = 'medium';
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];


// =================================================================================
// II. EVENT LISTENERS
// =================================================================================

// --- Menu Controls ---
pickXBtn.addEventListener('click', () => selectSymbol('x'));
pickOBtn.addEventListener('click', () => selectSymbol('o'));
difficultyBtns.forEach(btn => btn.addEventListener('click', () => selectDifficulty(btn.dataset.difficulty)));
newGameBtn.addEventListener('click', startGame);

// --- In-Game Controls ---
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
    cell.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && handleCellClick(e));
});
restartBtn.addEventListener('click', () => showModal(restartModal));

// --- Modal Controls ---
cancelRestartBtn.addEventListener('click', () => hideModal(restartModal));
confirmRestartBtn.addEventListener('click', () => { hideModal(restartModal); resetBoard(); });
quitBtn.addEventListener('click', () => {
    hideModal(resultModal);
    startMenu.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    scores = { player: 0, tie: 0, cpu: 0 }; // Reset scores on quit
    updateScoreboard();
});
nextRoundBtn.addEventListener('click', () => { hideModal(resultModal); resetBoard(); });


// =================================================================================
// III. CORE GAME FLOW & LOGIC
// =================================================================================

/**
 * Sets the player's chosen symbol (X or O) and updates the UI.
 * @param {string} symbol - The chosen symbol, 'x' or 'o'.
 */
function selectSymbol(symbol) {
    playerSymbol = symbol;
    cpuSymbol = (symbol === 'x') ? 'o' : 'x';
    pickXBtn.classList.toggle('active', symbol === 'x');
    pickOBtn.classList.toggle('active', symbol === 'o');
    cells.forEach(cell => {
        cell.classList.remove('x-hover', 'o-hover');
        cell.classList.add(`${playerSymbol}-hover`);
    });
}

/**
 * Sets the AI difficulty level from the UI.
 * @param {string} level - The chosen difficulty: 'easy', 'medium', or 'hard'.
 */
function selectDifficulty(level) {
    difficulty = level;
    difficultyBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.difficulty === level));
}

/**
 * Hides the start menu, shows the game screen, and starts the first round.
 */
function startGame() {
    startMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    playerScoreLabel.textContent = `${playerSymbol.toUpperCase()} (YOU)`;
    cpuScoreLabel.textContent = `${cpuSymbol.toUpperCase()} (CPU)`;
    resetBoard();
}

/**
 * Resets the game board and state for a new round.
 */
function resetBoard() {
    board.fill('');
    isGameOver = false;
    currentPlayer = 'x';
    cells.forEach(cell => {
        cell.className = 'board-cell'; // Reset classes
        cell.innerHTML = `<i></i>`;
        cell.classList.add(`${playerSymbol}-hover`);
        cell.setAttribute('aria-label', 'Empty');
        cell.setAttribute('tabindex', '0');
    });
    updateTurnIndicator();
    if (currentPlayer === cpuSymbol) {
        triggerCpuMove();
    }
}

/**
 * Handles player's interaction with a cell.
 * @param {Event} e - The click or keydown event.
 */
function handleCellClick(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    if (board[index] !== '' || isGameOver || currentPlayer !== playerSymbol) {
        return;
    }
    makeMove(index, playerSymbol);
    if (!isGameOver) {
        switchTurn();
        triggerCpuMove();
    }
}

/**
 * Places a symbol on the board, updates the UI, and checks for win/draw conditions.
 * @param {number} index - The board index (0-8).
 * @param {string} symbol - The symbol to place ('x' or 'o').
 */
function makeMove(index, symbol) {
    if (board[index] !== '' || isGameOver) return;
    board[index] = symbol;

    const cell = cells[index];
    cell.classList.add(symbol, 'show');
    cell.innerHTML = `<i class="bi bi-${symbol === 'x' ? 'x-lg' : 'circle'}"></i>`;
    cell.setAttribute('aria-label', `Cell marked as ${symbol.toUpperCase()}`);
    cell.setAttribute('tabindex', '-1');

    if (checkWin(symbol)) {
        endGame(false, symbol);
    } else if (board.every(cell => cell !== '')) {
        endGame(true); // Draw
    }
}

/**
 * Switches the turn to the other player.
 */
function switchTurn() {
    currentPlayer = (currentPlayer === 'x') ? 'o' : 'x';
    updateTurnIndicator();
}

/**
 * Ends the current round and displays the result after a delay.
 * @param {boolean} isDraw - True if the game is a draw.
 * @param {string|null} winner - The winning symbol, or null if it's a draw.
 */
function endGame(isDraw, winner = null) {
    isGameOver = true;
    if (!isDraw && winner) {
        const winPattern = winPatterns.find(pattern => pattern.every(index => board[index] === winner));
        winPattern.forEach(index => cells[index].classList.add('win-line'));
    }
    setTimeout(() => showResult(isDraw, winner), 750);
}


// =================================================================================
// IV. UI & MODAL MANAGEMENT
// =================================================================================

/**
 * Updates the turn indicator icon in the header.
 */
function updateTurnIndicator() {
    turnIcon.className = `bi bi-${currentPlayer === 'x' ? 'x-lg' : 'circle'}`;
}

/**
 * Configures and displays the result modal.
 * @param {boolean} isDraw - True if the game was a draw.
 * @param {string|null} winner - The winning symbol.
 */
function showResult(isDraw, winner) {
    if (isDraw) {
        scores.tie++;
        modalResultText.textContent = '';
        modalWinnerAnnouncement.innerHTML = `<h2 class="tie-color">ROUND TIED</h2>`;
    } else {
        const winnerIsPlayer = winner === playerSymbol;
        winnerIsPlayer ? scores.player++ : scores.cpu++;
        modalResultText.textContent = winnerIsPlayer ? 'YOU WON!' : 'OH NO, YOU LOST...';
        modalWinnerAnnouncement.innerHTML = `
            <i class="icon-winner bi bi-${winner === 'x' ? 'x-lg' : 'circle'}"></i>
            <h2 class="${winner}-win-color">TAKES THE ROUND</h2>`;
        modalWinnerAnnouncement.querySelector('.icon-winner').style.color = 
            winner === 'x' ? 'var(--clr-light-blue)' : 'var(--clr-light-yellow)';
    }
    updateScoreboard();
    showModal(resultModal);
}

/**
 * Updates the scores displayed in the footer.
 */
function updateScoreboard() {
    playerScoreEl.textContent = scores.player;
    tieScoreEl.textContent = scores.tie;
    cpuScoreEl.textContent = scores.cpu;
}

const showModal = (modal) => modal.classList.add('show');
const hideModal = (modal) => modal.classList.remove('show');


// =================================================================================
// V. ARTIFICIAL INTELLIGENCE (AI) LOGIC
// =================================================================================

/**
 * Initiates the AI's turn, including showing the "thinking" indicator and applying a delay.
 */
function triggerCpuMove() {
    if (isGameOver) return;
    thinkingIndicator.classList.add('visible');
    const delay = getDynamicDelay(difficulty);
    
    setTimeout(() => {
        thinkingIndicator.classList.remove('visible');
        const move = getComputerMove();
        if (move !== null) {
            makeMove(move, cpuSymbol);
            if (!isGameOver) {
                switchTurn();
            }
        }
    }, delay);
}

/**
 * Returns a thinking delay duration based on AI difficulty.
 * @param {string} level - The current difficulty level.
 * @returns {number} The delay in milliseconds.
 */
function getDynamicDelay(level) {
    switch(level) {
        case 'easy': return Math.random() * 600 + 400;   // 0.4s - 1.0s
        case 'hard': return Math.random() * 1200 + 800;  // 0.8s - 2.0s
        case 'medium':
        default:     return Math.random() * 1000 + 600;  // 0.6s - 1.6s
    }
}

/**
 * Selects the appropriate AI strategy based on the current difficulty.
 * @returns {number|null} The index of the board for the AI to move to.
 */
function getComputerMove() {
    switch (difficulty) {
        case 'easy': return getEasyMove();
        case 'medium': return getMediumMove();
        case 'hard': return getHardMove();
        default: return getRandomMove();
    }
}

// --- AI Helper Functions ---
const getEmptyCells = () => board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
const checkWin = (symbol) => winPatterns.some(pattern => pattern.every(index => board[index] === symbol));
const getRandomMove = () => {
    const emptyCells = getEmptyCells();
    return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
};

/**
 * Finds if a winning move exists for a given symbol.
 * @param {string} symbol - The symbol to check ('x' or 'o').
 * @returns {number|null} The index of the winning move, or null if none.
 */
function findWinningMove(symbol) {
    for (const index of getEmptyCells()) {
        board[index] = symbol;
        if (checkWin(symbol)) {
            board[index] = ''; return index;
        }
        board[index] = '';
    }
    return null;
}

/**
 * Finds a move that creates a "fork" (two potential winning lines).
 * @param {string} symbol - The symbol to check for a forking move.
 * @returns {number|null} The index of the forking move, or null if none.
 */
function findForkMove(symbol) {
    const emptyCells = getEmptyCells();
    if (emptyCells.length < 5) return null; // Not enough space to create a fork

    for (const index of emptyCells) {
        board[index] = symbol;
        let winOpportunities = 0;
        for(const nextIndex of getEmptyCells()) {
            board[nextIndex] = symbol;
            if(checkWin(symbol)) winOpportunities++;
            board[nextIndex] = '';
        }
        board[index] = '';
        if (winOpportunities >= 2) return index;
    }
    return null;
}

// --- AI Difficulty Strategies ---

/** EASY AI: Primarily defensive, rarely offensive, often makes random moves. */
function getEasyMove() {
    let blockMove = findWinningMove(playerSymbol);
    if (blockMove !== null) return blockMove;
    if (Math.random() < 0.20) { // 20% chance to find its own winning move
         let winMove = findWinningMove(cpuSymbol);
         if (winMove !== null) return winMove;
    }
    return getRandomMove();
}

/** MEDIUM AI: Knows basic strategy (win/block/center) but has a chance to make a random mistake. */
function getMediumMove() {
    if (Math.random() < 0.25) return getRandomMove(); // 25% chance of a random move
    let winMove = findWinningMove(cpuSymbol);
    if (winMove !== null) return winMove;
    let blockMove = findWinningMove(playerSymbol);
    if (blockMove !== null) return blockMove;
    if(board[4] === '') return 4;
    return getRandomMove();
}

/** HARD AI: Follows a strict hierarchy of optimal moves. Very challenging. */
function getHardMove() {
    // Priority 1: If a winning move exists, take it.
    let winMove = findWinningMove(cpuSymbol);
    if (winMove !== null) return winMove;
    // Priority 2: If the player can win, block them.
    let blockMove = findWinningMove(playerSymbol);
    if (blockMove !== null) return blockMove;
    // Priority 3: Create a fork to set up a future win.
    let forkMove = findForkMove(cpuSymbol);
    if (forkMove !== null) return forkMove;
    // Priority 4: Block the player's potential fork.
    let blockForkMove = findForkMove(playerSymbol);
    if (blockForkMove !== null) return blockForkMove;
    // Priority 5: Take the center square.
    if (board[4] === '') return 4;
    // Priority 6: Take the corner opposite the player.
    const corners = [0, 2, 6, 8];
    const playerCorners = corners.filter(c => board[c] === playerSymbol);
    if (playerCorners.length === 1) {
        const opposite = {0: 8, 2: 6, 6: 2, 8: 0};
        if (board[opposite[playerCorners[0]]] === '') return opposite[playerCorners[0]];
    }
    // Priority 7: Take any empty corner.
    const emptyCorners = corners.filter(c => board[c] === '');
    if (emptyCorners.length > 0) return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    // Priority 8: Take any remaining empty cell (sides).
    return getRandomMove();
}


// =================================================================================
// VI. INITIALIZATION
// =================================================================================

// Sets the default player symbol to 'X' when the script first loads.
selectSymbol('x');
