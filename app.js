// STATE
const state = {
    players: [
        {
            name: "",
            onTurn: true
        },
        {
            name: "",
            onTurn: false,
            isHuman: false,
            difficulty: "easy"
        }
    ],
    board: [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ],
    activeLetter: 'X'
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

const playerOneNameInput = document.getElementById("player_one_name_input");
const playerOneNameButton = document.getElementById("player_one_name_button");
const playerOneNameDisplay = document.getElementById("player_one_name");

const playerTwoNameInput = document.getElementById("player_two_name_input");
const playerTwoNameButton = document.getElementById("player_two_name_button");
const playerTwoNameDisplay = document.getElementById("player_two_name");

const playerInfoDivs = document.getElementsByClassName("player_info");

const difficultySelection = document.getElementById("difficulty_selection");

const gameGrid = document.getElementById("game_grid");

// EVENT LISTENERS
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
    if (playerOneNameInput.value) {
        state.players[0].name = playerOneNameInput.value;
    };
    playerOneNameButton.disabled = true;
    playerOneNameInput.disabled = true;
    enableStartButtonIfReady();
});

playerTwoNameButton.addEventListener("click", () => {
    if (playerTwoNameInput.value) {
        state.players[1].name = playerTwoNameInput.value;
    };
    playerTwoNameButton.disabled = true;
    playerTwoNameInput.disabled = true;
    enableStartButtonIfReady();
});

difficultySelection.addEventListener("change", (event) => {
    state.players[1].difficulty = event.target.value;
});

startGameButton.addEventListener("click", () => {
    secondScreen.style.display = "none";
    playerOneNameDisplay.innerText = state.players[0].name;
    playerTwoNameDisplay.innerText = state.players[1].name;
    gameScreen.style.display = "flex";
});

gameGrid.addEventListener("click", (event) => {
    if (!event.target.innerText) {
        const row = Array.from(gameGrid.children[0].children).indexOf(event.target.parentNode);
        const col = Array.from(event.target.parentNode.children).indexOf(event.target);
        event.target.innerText = state.activeLetter;
        state.board[row][col] = state.activeLetter;
        console.log(state.board);
        if (state.players[1].isHuman) {
            switchPlayers();
        }
    }
});

// HELPER FUNCTIONS
const switchToSecondScreen = () => {
    firstScreen.style.display = "none";
    secondScreen.style.display = "flex";
};

const enableStartButtonIfReady = () => {
    if (state.players[0].name && state.players[1].name) {
        startGameButton.disabled = false;
    };
};

const switchPlayers = () => {
    console.log("switch")
    for (let i = 0; i < state.players.length; i++) {
        state.players[i].onTurn = !state.players[i].onTurn;
        state.players[i].onTurn ? playerInfoDivs[i].style.border = "1px solid yellow" : playerInfoDivs[i].style.border = "none";
    }
    state.activeLetter === 'X' ? state.activeLetter = 'O' : state.activeLetter = 'X';
};