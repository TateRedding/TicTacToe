// STATE
const state = {
    players: [
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
    ],
    gridSize: 3,
    board: [],
    winningLines: [],
    currentTurn: '',
    activeLetter: 'X',
    totalMoves: 0,
    gameOver: false
};

// DOM SELCTORS
const firstScreen = document.getElementById("first_screen");
const secondScreen = document.getElementById("second_screen");
const gameScreen = document.getElementById("game_screen");
const playerTwoColumn = document.getElementById("player_two_column");
const computerColumn = document.getElementById("computer_column");

const vsHumanButton = document.getElementById("vs_human");
const vsComputerButton = document.getElementById("vs_computer");
const startGameButton = document.getElementById("start_game");

const customGridDiv = document.getElementById("custom_grid_div");
const customGridInput = document.getElementById("custom_grid_input");
const customGridButton = document.getElementById("custom_grid_button");

const gameStatusDisplay = document.getElementById("game_status");

// Can any of these be combined via class name?

const playerOneNameInput = document.getElementById("player_one_name_input");
const playerOneNameButton = document.getElementById("player_one_name_button");
const playerOneNameDisplay = document.getElementById("player_one_name");

const playerTwoNameInput = document.getElementById("player_two_name_input");
const playerTwoNameButton = document.getElementById("player_two_name_button");
const playerTwoNameDisplay = document.getElementById("player_two_name");

const playerInfoDivs = document.getElementsByClassName("player_info");

const difficultySelection = document.getElementById("difficulty_selection");
const gridSizeSelection = document.getElementById("grid_size_selection");

const gameGrid = document.getElementById("game_grid");

// EVENT LISTENERS

// --- SETTING UP THE GAME ---
vsHumanButton.addEventListener("click", () => {
    switchToSecondScreen();
    computerColumn.style.display = "none";
    state.players[1].isHuman = true;
});

vsComputerButton.addEventListener("click", () => {
    switchToSecondScreen();
    playerTwoColumn.style.display = "none";
    state.players[1].name = "Computer";
});

playerOneNameButton.addEventListener("click", () => {
    if (!playerOneNameInput.value) {
        return;
    };
    state.players[0].name = playerOneNameInput.value;
    playerOneNameButton.disabled = true;
    playerOneNameInput.disabled = true;
    state.currentTurn = state.players[0].name;
    enableStartButtonIfReady();
});

playerTwoNameButton.addEventListener("click", () => {
    if (!playerTwoNameInput.value) {
        return;
    };
    state.players[1].name = playerTwoNameInput.value;
    playerTwoNameButton.disabled = true;
    playerTwoNameInput.disabled = true;
    enableStartButtonIfReady();
});

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
        state.gridSize = 9;
    } else {
        state.gridSize = customGridInput.value;
    };
    customGridInput.disabled = true;
    customGridButton.disabled = true;
    enableStartButtonIfReady();
});

startGameButton.addEventListener("click", () => {
    createGrid();
    createWinningLinesArrays();
    secondScreen.style.display = "none";
    playerOneNameDisplay.innerText = state.players[0].name;
    playerTwoNameDisplay.innerText = state.players[1].name;
    gameStatusDisplay.innerText = `It's ${state.currentTurn}'s turn!`;
    gameScreen.style.display = "flex";
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
    const first = state.board[arr[0][0]][arr[0][1]];
    if (first === null) {
        return false;
    };
    for (let i = 1; i < arr.length; i++) {
        currResult = state.board[arr[i][0]][arr[i][1]];
        if (currResult === null || currResult !== first) {
            return false;
        };
    };
    return true;
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
        const newRowArr = [];
        for (let i = 0; i < state.gridSize; i++) {
            const newCell = document.createElement("td");
            newRow.appendChild(newCell);
            newRowArr.push(null);
        };
        gameGrid.appendChild(newRow);
        state.board.push(newRowArr);
    };
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

// --- COMPUTER OPPONENT AI ---

const computerTurn = () => {
    const possibleMoves = getAllPossibleMoves();
    const winningMove = getWinningMove(possibleMoves);
    if (winningMove !== null) {
        makeMove(winningMove);
        return;
    };
    if (state.players[1].difficulty !== "easy") {
        const blockingMove = getBlockingMove(possibleMoves);
        if (blockingMove !== null) {
            makeMove(blockingMove);
            return;
        };
        if (state.players[1].difficulty === "hard") {
            const goodMoves = getGoodMoves(possibleMoves);
            if (goodMoves.length > 0) {
                makeMove(getRandomMove(goodMoves));
                return;
            };
        };
    };
    makeMove(getRandomMove(possibleMoves));


};

const getAllPossibleMoves = () => {
    const moves = [];
    for (let i = 0; i < state.board.length; i++) {
        for(let j = 0; j < state.board[i].length; j++) {
            if (state.board[i][j] === null) {
                moves.push([i, j]);
            };
        };
    };
    return moves;

};

const getWinningMove = (moves) => {
    for (let i = 0; i < moves.length; i++) {
        for (let j = 0; j < state.winningLines.length; j++) {
            if (isInLine(moves[i], state.winningLines[j]) && doesMoveWin(moves[i], state.winningLines[j])) {
                return moves[i];
            };
        };
    };
    return null;
};

const doesMoveWin = (coord, lineArr) => {
    for (let i = 0; i < lineArr.length; i++) {
        if (coord[0] === lineArr[i][0] && coord[1] === lineArr[i][1]) {
            continue;
        };
        if (state.board[lineArr[i][0]][lineArr[i][1]] !== 'O') {
            return false;
        };
    };
    return true;
};

const getBlockingMove = (moves) => {
    for (let i = 0; i < moves.length; i++) {
        for (let j = 0; j < state.winningLines.length; j++) {
            if (isInLine(moves[i], state.winningLines[j]) && doesMoveBlock(moves[i], state.winningLines[j])) {
                return moves[i];
            };
        };
    };
    return null;
};

const doesMoveBlock = (coord, lineArr) => {
    for (let i = 0; i < lineArr.length; i++) {
        if (coord[0] === lineArr[i][0] && coord[1] === lineArr[i][1]) {
            continue;
        };
        if (state.board[lineArr[i][0]][lineArr[i][1]] !== 'X') {
            return false;
        };
    };
    return true;
};

const getGoodMoves = (moves) => {
    const goodMoves = [];
    for (let i = 0; i < moves.length; i++) {
        for (let j = 0; j < state.winningLines.length; j++) {
            if (isInLine(moves[i], state.winningLines[j]) && isMoveGood(state.winningLines[j])) {
                goodMoves.push(moves[i]);
            };
        };
    };
    return goodMoves;
};

const isMoveGood = (lineArr) => {
    for (let i = 0; i < lineArr.length; i++) {
        currResult = state.board[lineArr[i][0]][lineArr[i][1]];
        if (currResult === 'X') {
            return false;
        } else if (currResult !== null) {
            return true;
        };
    };
    return false;
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