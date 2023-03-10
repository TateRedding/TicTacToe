// STATE
const state = {};

// DOM SELCTORS
const firstScreen = document.getElementById("first_screen");
const secondScreen = document.getElementById("second_screen");
const gameScreen = document.getElementById("game_screen");
const playerTwoColumn = document.getElementById("player_two_column");
const computerColumn = document.getElementById("computer_column");

const vsHumanButton = document.getElementById("vs_human");
const vsComputerButton = document.getElementById("vs_computer");
const startGameButton = document.getElementById("start_game");

const customGridDiv = document.getElementById("custom_grid");
const customGridInput = document.getElementById("custom_grid_input");
const customGridButton = document.getElementById("custom_grid_button");

const gameStatusDisplay = document.getElementById("game_status");

const playerNameInputs = document.getElementsByClassName("player_name_input");
const playerNameButtons = document.getElementsByClassName("player_name_button");
const playerNameDisplays = document.getElementsByClassName("player_name");

const playerInfoDivs = document.getElementsByClassName("player_info");

const difficultySelection = document.getElementById("difficulty_selection");
const gridSizeSelection = document.getElementById("grid_size_selection");

const gameGrid = document.getElementById("game_grid");

const resetSameOptionsButton = document.getElementById("reset_same_options");
const fullResetButton = document.getElementById("full_reset");

// EVENT LISTENERS

// --- SETTING UP THE GAME ---
vsHumanButton.addEventListener("click", () => {
    switchToSecondScreen();
    playerTwoColumn.style.display = "flex";
    computerColumn.style.display = "none";
    state.players[1].isHuman = true;
});

vsComputerButton.addEventListener("click", () => {
    switchToSecondScreen();
    playerTwoColumn.style.display = "none";
    computerColumn.style.display = "flex";
    state.players[1].name = "Computer";
});

for (let i = 0; i < playerNameButtons.length; i++) {
    playerNameButtons[i].addEventListener("click", () => {
        if (!playerNameInputs[i].value) {
            return;
        };
        state.players[i].name = playerNameInputs[i].value;
        playerNameButtons[i].disabled = true;
        playerNameInputs[i].disabled = true;
        enableStartButtonIfReady();
        if (i === 0) {
            state.currentTurn = state.players[i].name;
        };
    });
};

difficultySelection.addEventListener("change", (event) => {
    state.players[1].difficulty = event.target.value;
});

gridSizeSelection.addEventListener("change", (event) => {
    if (event.target.value === "custom") {
        customGridDiv.style.visibility = "visible";
        state.gridSize = 0;
    } else {
        customGridDiv.style.visibility = "hidden";
        state.gridSize = Number(event.target.value);
    };
    enableStartButtonIfReady();
});

customGridButton.addEventListener("click", () => {
    if (!customGridInput.value) {
        return;
    } else if (customGridInput.value > 9) {
        customGridInput.value = 9;
    }
    state.gridSize = customGridInput.value;
    customGridInput.disabled = true;
    customGridButton.disabled = true;
    enableStartButtonIfReady();
});

startGameButton.addEventListener("click", () => {
    createGrid();
    createWinningLinesArrays();
    secondScreen.style.display = "none";
    gameStatusDisplay.innerText = `It's ${state.currentTurn}'s turn!`;
    gameScreen.style.display = "flex";
    for (let i = 0; i < playerNameDisplays.length; i++) {
        playerNameDisplays[i].innerText = state.players[i].name;
    };
});

// --- PLAYING THE GAME ---

gameGrid.addEventListener("click", (event) => {
    if (state.gameOver) {
        return;
    };
    if (!event.target.innerText) {
        const row = Array.from(gameGrid.children).indexOf(event.target.parentNode);
        const col = Array.from(event.target.parentNode.children).indexOf(event.target);
        event.target.innerText = state.activeLetter;
        state.board[row][col] = state.activeLetter;
        state.totalMoves++;

        if (!isGameWon() && !isBoardFull()) {
            switchPlayers();
        };
    };
});

// --- RESETTING THE GAME ---

fullResetButton.addEventListener("click", () => {
    resetState();
    gameGrid.innerHTML = '';
    difficultySelection.value = "easy";
    gridSizeSelection.value = "3";
    startGameButton.disabled = true;
    gameScreen.style.display = "none";
    secondScreen.style.display = "none";
    firstScreen.style.display = "flex";
    customGridInput.value = '';
    customGridInput.disabled = false;
    customGridButton.disabled = false;
    customGridDiv.style.visibility = "hidden";
    for (let i = 0; i < playerNameInputs.length; i++) {
        playerNameInputs[i].value = '';
        playerNameInputs[i].disabled = false;
        playerNameButtons[i].disabled = false;
    };
});

resetSameOptionsButton.addEventListener("click", () => {
    state.currentTurn === state.players[1].name ? switchPlayers() : gameStatusDisplay.innerText = `It's ${state.currentTurn}'s turn!`;
    for (let i = 0; i < gameGrid.children.length; i++) {
        for (let j = 0; j < gameGrid.children[i].children.length; j++) {
            currCell = gameGrid.children[i].children[j];
            currCell.innerText = '';
            currCell.style.fontWeight = "normal";
            currCell.style.color = "black";
        };
    };
    state.totalMoves = 0;
    state.gameOver = false;
    resetBoard();
});

// HELPER FUNCTIONS
const switchToSecondScreen = () => {
    firstScreen.style.display = "none";
    secondScreen.style.display = "flex";
};

const enableStartButtonIfReady = () => {
    if (state.players[0].name && state.players[1].name && state.gridSize) {
        startGameButton.disabled = false;
    };
};

const switchPlayers = () => {
    for (let i = 0; i < state.players.length; i++) {
        state.players[i].onTurn = !state.players[i].onTurn;
        state.players[i].onTurn ? playerInfoDivs[i].classList.add("current_turn_display"): playerInfoDivs[i].classList.remove("current_turn_display");
    };
    state.activeLetter === 'X' ? state.activeLetter = 'O' : state.activeLetter = 'X';
    state.currentTurn === state.players[0].name ? state.currentTurn = state.players[1].name : state.currentTurn = state.players[0].name;
    gameStatusDisplay.innerText = `It's ${state.currentTurn}'s turn!`;
    if (state.currentTurn === state.players[1].name && !state.players[1].isHuman) {
        computerTurn();
    };
};

const isGameWon = () => {
    for (let i = 0; i < state.winningLines.length; i++) {
        if (isAllTheSame(state.winningLines[i])) {
            triggerWin(state.winningLines[i]);
            return true;
        };
    };
    return false;
};

const isAllTheSame = (arr) => {
    const lineSet = new Set();
    for (let i = 0; i < arr.length; i++) {
        lineSet.add(state.board[arr[i][0]][arr[i][1]])
    };
     if (lineSet.size === 1 && !lineSet.has(null)) {
        return true;
     }
     return false;
};

const triggerWin = (arr) => {
    state.gameOver = true;
    gameStatusDisplay.innerText = `${state.currentTurn} wins!`
    for (let i = 0; i < arr.length; i++) {
        currChild = gameGrid.children[arr[i][0]].children[arr[i][1]];
        currChild.style.fontWeight = "bold";
        currChild.style.color = "red";
    };
};

const isBoardFull = () => {
    if (state.totalMoves >= state.gridSize * state.gridSize) {
        state.gameOver = true;
        gameStatusDisplay.innerText = `Game over! No one wins!`;
        playerInfoDivs[0].classList.remove("current_turn_display");
        playerInfoDivs[1].classList.remove("current_turn_display");
        return true;
    };
    return false;
};

// --- INITIALIZING THE GAME ---

const createGrid = () => {
    for (let i = 0; i < state.gridSize; i++) {
        const newRow = document.createElement("tr");
        for (let i = 0; i < state.gridSize; i++) {
            const newCell = document.createElement("td");
            newRow.appendChild(newCell);
        };
        gameGrid.appendChild(newRow);
    };
    const cells = document.getElementsByTagName("td");
    for (let i = 0; i < cells.length; i++) {
        const size = 400/(cells.length/state.gridSize);
        cells[i].style.width = `${size}px`;
        cells[i].style.height = `${size}px`;
        cells[i].style.fontSize = `${size * .5}px`;
    };
    resetBoard();
};

const createWinningLinesArrays = () => {
    const leftToRight = [];
    const rightToLeft = [];
    for (let i = 0; i < state.gridSize; i++) {
        const currRow = [];
        const currCol = [];
        for (let j = 0; j < state.gridSize; j++) {
            currRow.push([i, j]);
            currCol.push([j, i]);
        };
        leftToRight.push([i, i]);
        rightToLeft.push([i, state.gridSize-(i+1)]);
        state.winningLines.push(currRow);
        state.winningLines.push(currCol);
    };
    state.winningLines.push(leftToRight);
    state.winningLines.push(rightToLeft);
};

const resetState = () => {
    state.players = [
        {
            name: "",
            onTurn: true,
        },
        {
            name: "",
            onTurn: false,
            isHuman: false,
            difficulty: "easy"
        }
    ];
    state.gridSize = 3;
    state.board = [];
    state.winningLines = [];
    state.currentTurn = '';
    state.activeLetter = 'X';
    state.totalMoves = 0;
    state.gameOver = false;
};

const resetBoard = () => {
    state.board = [];
    for (let i = 0; i < state.gridSize; i++) {
        const newRowArr = [];
        for (let i = 0; i < state.gridSize; i++) {
            newRowArr.push(null);
        };
        state.board.push(newRowArr);
    };
};

// --- COMPUTER OPPONENT AI ---

const computerTurn = () => {
    const possibleMoves = getAllPossibleMoves();

    for (let i = 0; i < possibleMoves.length; i++) {
        if (possibleMoves[i][2] === 3) {
            makeMove(possibleMoves[i]);
            return;
        };
        if (state.players[1].difficulty !== "easy" && possibleMoves[i][2] === 2) {
            makeMove(possibleMoves[i]);
            return;
        };
    };

    const goodMoves = possibleMoves.filter(move => move[2] === 1);
    if ( state.players[1].difficulty === "hard" && goodMoves.length > 0) {
        makeMove(getRandomMove(goodMoves));
        return;
    };
    makeMove(getRandomMove(possibleMoves));
};

const getAllPossibleMoves = () => {
    const moves = [];
    for (let i = 0; i < state.board.length; i++) {
        for(let j = 0; j < state.board[i].length; j++) {
            if (state.board[i][j] === null) {
                moves.push([i, j, 0]);
            };
        };
    };
    assignMoveWeights(moves);
    return moves;
};

const assignMoveWeights = (moves) => {
    for (let i = 0; i < moves.length; i++) {
        for (let j = 0; j < state.winningLines.length; j++) {
            if (isInLine(moves[i], state.winningLines[j])) {
                const currWeight = determineWeight(moves[i], state.winningLines[j]);
                if (currWeight > moves[i][2]) {
                    moves[i][2] = currWeight;
                };
            };
        };
    };
};

const determineWeight = (coord, lineArr) => {
    const allOtherValues = new Set();
    for (let i = 0; i < lineArr.length; i++) {
        if (lineArr[i][0] === coord[0] && lineArr[i][1] === coord[1]) {
            continue;
        };
        allOtherValues.add(state.board[lineArr[i][0]][lineArr[i][1]]);
    };
    if (allOtherValues.size === 1) {
        if (allOtherValues.has('O')) {
            return 3;
        } else if (allOtherValues.has('X')) {
            return 2;
        };
    } else if (!allOtherValues.has('X') && allOtherValues.has(null)) {
        return 1;
    };
    return 0;
};

const isInLine = (coord, lineArr) => {
    for (let i = 0; i < lineArr.length; i++) {
        if (coord[0] === lineArr[i][0] && coord[1] === lineArr[i][1]) {
            return true;
        };
    };
    return false;
};

const getRandomMove = (moves) => {
    const index = Math.floor(Math.random() * moves.length);
    return moves[index];
};

const makeMove = (coord) => {
    state.board[coord[0]][coord[1]] = 'O';
    gameGrid.children[coord[0]].children[coord[1]].innerText = 'O';
    state.totalMoves++;
    if (!isGameWon() && !isBoardFull()) {
        switchPlayers();
    };
};

resetState();