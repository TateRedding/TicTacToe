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
    currentTurn: '',
    activeLetter: 'X',
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

        winCheck();
        fullBoardCheck();

        if (!state.gameOver) {
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
};

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

const winCheck = () => {
    for (let i = 0; i < state.gridSize; i++) {
        if (isAllTheSame(getRow(i))) {
            triggerWin(state.currentTurn, getRow(i));
            return;
        };
        if (isAllTheSame(getColumn(i))) {
            triggerWin(state.currentTurn, getColumn(i));
            return;
        };
    };
    if (isAllTheSame(getLtoRDiagonal())) {
        triggerWin(state.currentTurn, getLtoRDiagonal());
        return;
    };
    if (isAllTheSame(getRtoLDiagonal())) {
        triggerWin(state.currentTurn, getRtoLDiagonal());
        return;
    };
};

const getRow = (num) => {
    let result = [];
    for (let i = 0; i < state.gridSize; i++) {
        result.push([num, i]);
    };
    return result;
};

const getColumn = (num) => {
    let result = [];
    for (let i = 0; i < state.gridSize; i++) {
        result.push([i, num]);
    };
    return result;
};

const getLtoRDiagonal = () => {
    let result = [];
    for (let i = 0; i < state.gridSize; i++) {
        result.push([i, i]);
    };
    return result;
};

const getRtoLDiagonal = () => {
    let result = [];
    for (let i = 0; i < state.gridSize; i++) {
        result.push([i, state.gridSize-(i+1)]);
    };
    return result;
};

const isAllTheSame = (arr) => {
    if (state.board[arr[0][0]][arr[0][1]] === null) {
        return false;
    };
    const first = state.board[arr[0][0]][arr[0][1]];
    for (let i = 1; i < arr.length; i++) {
        currResult = state.board[arr[i][0]][arr[i][1]];
        if (currResult === null || currResult !== first) {
            return false;
        };
    };
    return true;
};

const triggerWin = (player, arr) => {
    state.gameOver = true;
    gameStatusDisplay.innerText = `${state.currentTurn} wins!`
    for (let i = 0; i < arr.length; i++) {
        currChild = gameGrid.children[arr[i][0]].children[arr[i][1]];
        currChild.style.fontWeight = "bold";
        currChild.style.color = "red";
    };
};

const fullBoardCheck = () => {
    if (state.gameOver) {
        return;
    };
    for (let i = 0; i < state.gridSize; i++) {
        for (let j = 0; j < state.gridSize; j++) {
            if (state.board[i][j] === null) {
                return;
            };
        };
    };

    state.gameOver = true;
    gameStatusDisplay.innerText = `Game over! No one wins!`;

};

// Is there possibly a simpler soplution to full board check? Maybe keep track of how many times a td has been altered,
// and check if its ever equal to gridsize squared

// Would there be a better way to format winCheck/ full borardCheck so that they return booleans
// in an effort for cleaner code in the gamegrid event listener

// AI
// in grid event listener, should check if player 2 is computer and on turn, if so, return out of function
//get all possible moves
//get all winning moves

// easy looks for a win, then picks at random

//medium will look for a win, then try to block me, then move at random

// hard will look for a win, then try to block, then try to make best move to put itself in a winning position (something that puts a second O in a row/ only one more move to win)

// extra hard, which i wont do, wuld look several steps ahead, trying to strategize best way to create a position of two possible win moves in one turn